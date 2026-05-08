export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/session'
import { db } from '@/lib/db'

const schema = z.object({
  language: z.enum(['python', 'javascript', 'typescript', 'go', 'java', 'cpp', 'sql', 'html', 'css']),
  dailyGoal: z.enum(['casual', 'regular', 'serious', 'intense']),
})

const DAILY_MINUTES: Record<string, number> = {
  casual: 15,
  regular: 30,
  serious: 60,
  intense: 120,
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const { language, dailyGoal } = schema.parse(body)

    await db.userProfile.upsert({
      where: { userId: session.user.id },
      update: {
        preferredLanguage: language,
        dailyGoalMinutes: DAILY_MINUTES[dailyGoal],
      },
      create: {
        userId: session.user.id,
        preferredLanguage: language,
        dailyGoalMinutes: DAILY_MINUTES[dailyGoal],
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
