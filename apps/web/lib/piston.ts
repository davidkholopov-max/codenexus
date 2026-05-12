// Piston v1 API — no auth required, supports all languages
const PISTON_V1_URL = 'https://emkc.org/api/v1/piston/execute'

const LANGUAGE_MAP: Record<string, string> = {
  python:     'python3',
  javascript: 'javascript',
  typescript: 'typescript',
  go:         'go',
  java:       'java',
  cpp:        'c++',
  sql:        'sqlite3',
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
  const pistonLang = LANGUAGE_MAP[language]
  if (!pistonLang) throw new Error(`Unsupported language: ${language}`)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(PISTON_V1_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        language: pistonLang,
        source: code,
        stdin,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Piston error ${res.status}: ${text}`)
    }

    const data = await res.json()

    return {
      stdout: data.stdout ?? '',
      stderr: data.stderr ?? '',
      output: data.output ?? data.stdout ?? '',
      exitCode: data.ran ? 0 : 1,
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
