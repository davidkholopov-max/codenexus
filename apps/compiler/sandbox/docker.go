package sandbox

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"
)

// Runner is the interface for executing code.
type Runner interface {
	Run(ctx context.Context, req RunRequest) (*RunResult, error)
}

type RunRequest struct {
	Code     string
	Language string
	Stdin    string
}

type RunResult struct {
	Output   string
	ExitCode int
	TimedOut bool
}

type Config struct {
	MaxConcurrent int
	TimeoutMs     int
	Network       string
	MemoryLimitMB int64
	CPUQuota      int64
}

type DockerRunner struct {
	http      *http.Client
	config    Config
	semaphore chan struct{}
	images    map[string]string
}

var defaultImages = map[string]string{
	"python":     "codenexus-runner-python:latest",
	"javascript": "codenexus-runner-node:latest",
	"typescript": "codenexus-runner-node:latest",
	"go":         "codenexus-runner-go:latest",
	"java":       "codenexus-runner-java:latest",
	"cpp":        "codenexus-runner-cpp:latest",
	"sql":        "codenexus-runner-sqlite:latest",
}

func NewDockerRunner(cfg Config) (*DockerRunner, error) {
	socketPath := "/var/run/docker.sock"
	if host := os.Getenv("DOCKER_HOST"); host != "" {
		socketPath = strings.TrimPrefix(host, "unix://")
	} else {
		// Colima (macOS) fallback
		if _, err := os.Stat(socketPath); os.IsNotExist(err) {
			home, _ := os.UserHomeDir()
			colimaSocket := home + "/.colima/default/docker.sock"
			if _, err2 := os.Stat(colimaSocket); err2 == nil {
				socketPath = colimaSocket
			}
		}
	}

	transport := &http.Transport{
		DialContext: func(ctx context.Context, _, _ string) (net.Conn, error) {
			return (&net.Dialer{}).DialContext(ctx, "unix", socketPath)
		},
	}

	return &DockerRunner{
		http:      &http.Client{Transport: transport},
		config:    cfg,
		semaphore: make(chan struct{}, cfg.MaxConcurrent),
		images:    defaultImages,
	}, nil
}

func (r *DockerRunner) Run(ctx context.Context, req RunRequest) (*RunResult, error) {
	select {
	case r.semaphore <- struct{}{}:
		defer func() { <-r.semaphore }()
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	image, ok := r.images[req.Language]
	if !ok {
		return nil, fmt.Errorf("unsupported language: %s", req.Language)
	}

	timeout := time.Duration(r.config.TimeoutMs) * time.Millisecond
	runCtx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	name := "codenexus-run-" + uuid.New().String()[:8]
	cmd := buildCommand(req.Language, req.Code)

	// Create container
	createBody := map[string]any{
		"Image": image,
		"Cmd":   cmd,
		"AttachStdout": true,
		"AttachStderr": true,
		"NetworkDisabled": r.config.Network == "none",
		"HostConfig": map[string]any{
			"AutoRemove": true,
			"CapDrop":    []string{"ALL"},
			"SecurityOpt": []string{"no-new-privileges"},
		},
	}

	body, _ := json.Marshal(createBody)
	resp, err := r.dockerPost(runCtx, "/containers/create?name="+name, body)
	if err != nil {
		return nil, fmt.Errorf("create container: %w", err)
	}
	defer resp.Body.Close()

	var created struct{ Id string }
	if err := json.NewDecoder(resp.Body).Decode(&created); err != nil {
		return nil, fmt.Errorf("decode create response: %w", err)
	}
	if created.Id == "" {
		return nil, fmt.Errorf("empty container id")
	}
	id := created.Id

	// Always clean up
	defer func() {
		cleanCtx, cleanCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cleanCancel()
		delResp, err := r.dockerDo(cleanCtx, "DELETE", "/containers/"+id+"?force=true&v=true", nil)
		if err == nil {
			delResp.Body.Close()
		}
	}()

	// Start container
	startResp, err := r.dockerPost(runCtx, "/containers/"+id+"/start", nil)
	if err != nil {
		return nil, fmt.Errorf("start container: %w", err)
	}
	startResp.Body.Close()

	// Stream logs
	logResp, err := r.dockerDo(runCtx, "GET",
		"/containers/"+id+"/logs?stdout=1&stderr=1&follow=1&timestamps=0", nil)
	if err != nil {
		return nil, fmt.Errorf("logs: %w", err)
	}
	defer logResp.Body.Close()

	output, err := readDockerLogs(logResp.Body)
	timedOut := runCtx.Err() != nil
	if err != nil && !timedOut {
		return nil, fmt.Errorf("read logs: %w", err)
	}

	// Get exit code
	exitCode := 0
	if !timedOut {
		inspectCtx, iCancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer iCancel()
		iResp, err := r.dockerDo(inspectCtx, "GET", "/containers/"+id+"/json", nil)
		if err == nil {
			var info struct{ State struct{ ExitCode int } }
			if json.NewDecoder(iResp.Body).Decode(&info) == nil {
				exitCode = info.State.ExitCode
			}
			iResp.Body.Close()
		}
	}

	if len(output) > 100_000 {
		output = output[:100_000] + "\n[output truncated]"
	}

	return &RunResult{Output: output, ExitCode: exitCode, TimedOut: timedOut}, nil
}

// readDockerLogs parses Docker's multiplexed log stream (8-byte header frames).
func readDockerLogs(r io.Reader) (string, error) {
	var buf bytes.Buffer
	header := make([]byte, 8)
	for {
		_, err := io.ReadFull(r, header)
		if err == io.EOF || err == io.ErrUnexpectedEOF {
			break
		}
		if err != nil {
			return buf.String(), err
		}
		size := binary.BigEndian.Uint32(header[4:8])
		if size == 0 {
			continue
		}
		if _, err := io.CopyN(&buf, r, int64(size)); err != nil {
			break
		}
	}
	return buf.String(), nil
}

func (r *DockerRunner) dockerPost(ctx context.Context, path string, body []byte) (*http.Response, error) {
	return r.dockerDo(ctx, "POST", path, body)
}

func (r *DockerRunner) dockerDo(ctx context.Context, method, path string, body []byte) (*http.Response, error) {
	var bodyReader io.Reader
	if body != nil {
		bodyReader = bytes.NewReader(body)
	}
	req, err := http.NewRequestWithContext(ctx, method, "http://docker"+path, bodyReader)
	if err != nil {
		return nil, err
	}
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	return r.http.Do(req)
}

// writeFileCmd returns a shell command that writes content to a file via base64,
// handling all special characters (quotes, newlines, etc.) safely.
func writeFileCmd(path, content string) string {
	encoded := base64.StdEncoding.EncodeToString([]byte(content))
	return fmt.Sprintf(`echo '%s' | base64 -d > %s`, encoded, path)
}

func buildCommand(language, code string) []string {
	switch language {
	case "python":
		return []string{"python3", "-c", code}
	case "javascript":
		return []string{"node", "-e", code}
	case "typescript":
		write := writeFileCmd("/tmp/code.ts", code)
		return []string{"sh", "-c", write + ` && ts-node --skip-project --compiler-options '{"module":"CommonJS","esModuleInterop":true}' /tmp/code.ts`}
	case "go":
		write := writeFileCmd("/tmp/main.go", code)
		return []string{"sh", "-c", write + " && go run /tmp/main.go"}
	case "java":
		write := writeFileCmd("/tmp/Main.java", code)
		return []string{"sh", "-c", write + " && javac /tmp/Main.java -d /tmp && java -cp /tmp Main"}
	case "cpp":
		write := writeFileCmd("/tmp/main.cpp", code)
		return []string{"sh", "-c", write + " && g++ -o /tmp/prog /tmp/main.cpp && /tmp/prog"}
	case "sql":
		return []string{"sqlite3", ":memory:", code}
	default:
		return []string{"echo", "Unsupported language"}
	}
}

func escapeShell(s string) string {
	return strings.ReplaceAll(s, "'", "'\"'\"'")
}
