import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { runCode } from '@/lib/piston'

const executeSchema = z.object({
  code: z.string().max(50_000),
  language: z.enum(['python', 'javascript', 'typescript', 'go', 'java', 'cpp', 'sql']),
  lessonId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { code, language } = executeSchema.parse(body)

    const start = Date.now()
    const result = await runCode(language, code)
    const executedMs = Date.now() - start

    if (result.timedOut) {
      return NextResponse.json({ status: 'timeout', output: 'Execution timed out.', executedMs })
    }

    const output = result.output || result.stderr || ''
    const status = result.exitCode === 0 ? 'success' : 'error'

    return NextResponse.json({ status, output, executedMs })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ status: 'error', output: 'Invalid request.' }, { status: 400 })
    }
    console.error('[execute]', err)
    return NextResponse.json({ status: 'error', output: 'Execution service unavailable.' }, { status: 502 })
  }
}
