export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { runCode } from '@/lib/piston'

const schema = z.object({
  lessonId: z.string(),
  code: z.string().max(50_000),
  language: z.enum(['python', 'javascript', 'typescript', 'go', 'java', 'cpp', 'sql']),
})

interface TestCase {
  input?: string
  expectedOutput: string
  isHidden?: boolean
  matchType?: 'exact' | 'contains' | 'non_empty' | 'line_count'
  suffixCode?: string
}

function checkOutput(actual: string, tc: TestCase): boolean {
  const trimmedActual = actual.trim()
  const expected = (tc.expectedOutput ?? '').trim()

  switch (tc.matchType) {
    case 'contains':
      return trimmedActual.includes(expected)
    case 'non_empty':
      return trimmedActual !== ''
    case 'line_count': {
      const required = parseInt(expected, 10)
      const count = trimmedActual.split('\n').filter(l => l.trim() !== '').length
      return count >= required
    }
    default: // 'exact' or undefined
      return trimmedActual === expected
  }
}

export async function POST(req: NextRequest) {
  try {
    const { lessonId, code, language } = schema.parse(await req.json())

    const exercise = await db.exercise.findUnique({
      where: { lessonId },
      select: { testCases: true },
    })

    if (!exercise) {
      return NextResponse.json({ message: 'Exercise not found' }, { status: 404 })
    }

    const testCases = exercise.testCases as unknown as TestCase[]
    const results = []
    let passed = 0
    const start = Date.now()

    for (const tc of testCases) {
      const codeToRun = tc.suffixCode ? code + '\n' + tc.suffixCode : code

      let actual = ''
      let testPassed = false

      try {
        const result = await runCode(language, codeToRun, tc.input ?? '')
        if (!result.timedOut && result.exitCode === 0) {
          actual = result.output.trim()
          testPassed = checkOutput(actual, tc)
        } else {
          actual = result.stderr || result.output || ''
        }
      } catch {
        actual = ''
      }

      if (testPassed) passed++

      results.push({
        passed: testPassed,
        actualOutput: actual,
        expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
        isHidden: tc.isHidden ?? false,
      })
    }

    const total = testCases.length
    const score = total > 0 ? Math.round((passed / total) * 100) : 0
    const allPassed = score === 100

    return NextResponse.json({
      status: allPassed ? 'passed' : 'failed',
      score,
      passed: allPassed,
      results,
      executedMs: Date.now() - start,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 400 })
    }
    console.error('[validate]', err)
    return NextResponse.json({ status: 'error', score: 0, passed: false, results: [] }, { status: 500 })
  }
}
