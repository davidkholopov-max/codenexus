package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/codenexus/compiler/sandbox"
)

type Handler struct {
	runner sandbox.Runner
}

func New(runner sandbox.Runner) *Handler {
	return &Handler{runner: runner}
}

type ExecuteRequest struct {
	Code     string `json:"code"`
	Language string `json:"language"`
	LessonID string `json:"lessonId,omitempty"`
}

type ExecuteResponse struct {
	Status     string `json:"status"`   // "success" | "error" | "timeout"
	Output     string `json:"output"`
	ExecutedMs int64  `json:"executedMs,omitempty"`
}

type ValidateRequest struct {
	Code       string          `json:"code"`
	Language   string          `json:"language"`
	TestCases  []TestCase      `json:"testCases"`
}

type TestCase struct {
	Input          string `json:"input"`
	ExpectedOutput string `json:"expectedOutput"`
	IsHidden       bool   `json:"isHidden"`
	// MatchType controls how output is compared:
	//   "exact" (default) — trimmed exact match
	//   "contains"        — output contains expectedOutput string
	//   "non_empty"       — output is non-empty (code ran and printed something)
	MatchType  string `json:"matchType,omitempty"`
	// SuffixCode is appended to user code before running (used for variable-existence checks).
	SuffixCode string `json:"suffixCode,omitempty"`
}

type ValidateResponse struct {
	Status     string       `json:"status"`
	Score      int          `json:"score"` // 0-100
	Results    []TestResult `json:"results"`
	ExecutedMs int64        `json:"executedMs"`
}

type TestResult struct {
	Passed         bool   `json:"passed"`
	ActualOutput   string `json:"actualOutput"`
	ExpectedOutput string `json:"expectedOutput,omitempty"`
	IsHidden       bool   `json:"isHidden"`
}

func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func (h *Handler) Execute(w http.ResponseWriter, r *http.Request) {
	var req ExecuteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"status":"error","output":"Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Code) == "" {
		respond(w, ExecuteResponse{Status: "error", Output: "Code cannot be empty"})
		return
	}

	if !isValidLanguage(req.Language) {
		respond(w, ExecuteResponse{Status: "error", Output: "Unsupported language: " + req.Language})
		return
	}

	start := time.Now()
	result, err := h.runner.Run(r.Context(), sandbox.RunRequest{
		Code:     req.Code,
		Language: req.Language,
	})
	elapsed := time.Since(start).Milliseconds()

	if err != nil {
		respond(w, ExecuteResponse{Status: "error", Output: err.Error(), ExecutedMs: elapsed})
		return
	}

	status := "success"
	if result.TimedOut {
		status = "timeout"
	} else if result.ExitCode != 0 {
		status = "error"
	}

	respond(w, ExecuteResponse{
		Status:     status,
		Output:     result.Output,
		ExecutedMs: elapsed,
	})
}

func (h *Handler) Validate(w http.ResponseWriter, r *http.Request) {
	var req ValidateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"status":"error"}`, http.StatusBadRequest)
		return
	}

	var results []TestResult
	passed := 0
	start := time.Now()

	for _, tc := range req.TestCases {
		code := req.Code
		if tc.SuffixCode != "" {
			code = req.Code + "\n" + tc.SuffixCode
		}

		result, err := h.runner.Run(r.Context(), sandbox.RunRequest{
			Code:     code,
			Language: req.Language,
			Stdin:    tc.Input,
		})

		var actual string
		testPassed := false

		if err == nil && result.ExitCode == 0 {
			actual = strings.TrimSpace(result.Output)
			expected := strings.TrimSpace(tc.ExpectedOutput)
			switch tc.MatchType {
			case "contains":
				testPassed = strings.Contains(actual, expected)
			case "non_empty":
				testPassed = actual != ""
			case "line_count":
				// expectedOutput = required number of non-empty lines
				required, _ := strconv.Atoi(strings.TrimSpace(expected))
				count := 0
				for _, line := range strings.Split(actual, "\n") {
					if strings.TrimSpace(line) != "" {
						count++
					}
				}
				testPassed = count >= required
			default: // "exact" or ""
				testPassed = actual == expected
			}
		}

		if testPassed {
			passed++
		}

		tr := TestResult{
			Passed:       testPassed,
			ActualOutput: actual,
			IsHidden:     tc.IsHidden,
		}
		if !tc.IsHidden {
			tr.ExpectedOutput = tc.ExpectedOutput
		}
		results = append(results, tr)
	}

	total := len(req.TestCases)
	score := 0
	if total > 0 {
		score = (passed * 100) / total
	}

	status := "passed"
	if score < 100 {
		status = "failed"
	}

	respond(w, ValidateResponse{
		Status:     status,
		Score:      score,
		Results:    results,
		ExecutedMs: time.Since(start).Milliseconds(),
	})
}

func respond(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}

var validLanguages = map[string]bool{
	"python": true, "javascript": true, "typescript": true,
	"go": true, "java": true, "cpp": true, "sql": true,
}

func isValidLanguage(lang string) bool {
	return validLanguages[lang]
}
