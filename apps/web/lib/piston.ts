const PISTON_URL = process.env.PISTON_API_URL ?? 'https://emkc.org/api/v2/piston'

// Map our language names → Piston runtime + version
const PISTON_RUNTIMES: Record<string, { language: string; version: string; filename?: string }> = {
  python:     { language: 'python',     version: '3.10.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  go:         { language: 'go',         version: '1.16.2' },
  java:       { language: 'java',       version: '15.0.2',  filename: 'Main.java' },
  cpp:        { language: 'c++',        version: '10.2.0',  filename: 'main.cpp' },
  sql:        { language: 'sqlite3',    version: '3.36.0' },
}

export interface PistonResult {
  stdout: string
  stderr: string
  output: string
  exitCode: number
  timedOut: boolean
}

export async function runCode(
  language: string,
  code: string,
  stdin = '',
  timeoutMs = 10_000
): Promise<PistonResult> {
  const runtime = PISTON_RUNTIMES[language]
  if (!runtime) throw new Error(`Unsupported language: ${language}`)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${PISTON_URL}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        language: runtime.language,
        version: runtime.version,
        files: [{ name: runtime.filename ?? 'code', content: code }],
        stdin,
        run_timeout: timeoutMs,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Piston error ${res.status}: ${text}`)
    }

    const data = await res.json()

    // If compilation failed, surface the compile error
    if (data.compile && data.compile.code !== 0) {
      return {
        stdout: '',
        stderr: data.compile.stderr ?? data.compile.output ?? 'Compilation failed',
        output: data.compile.stderr ?? data.compile.output ?? 'Compilation failed',
        exitCode: data.compile.code ?? 1,
        timedOut: false,
      }
    }

    const run = data.run ?? data.compile ?? {}

    return {
      stdout: run.stdout ?? '',
      stderr: run.stderr ?? '',
      output: run.output ?? run.stdout ?? '',
      exitCode: run.code ?? 0,
      timedOut: false,
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { stdout: '', stderr: 'Timed out', output: '', exitCode: 1, timedOut: true }
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}
