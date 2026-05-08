export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/session'
import { db } from '@/lib/db'
import { awardXP } from '@/lib/xp'

const schema = z.object({
  lessonId: z.string(),
  score: z.number().min(0).max(100).default(100),
})

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const { lessonId, score } = schema.parse(await req.json())

    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      select: { xpReward: true, id: true },
    })
    if (!lesson) return NextResponse.json({ message: 'Lesson not found' }, { status: 404 })

    // Fetch existing progress to preserve bestScore and avoid double XP
    const existing = await db.userProgress.findUnique({
      where: { userId_lessonId: { userId: session.user.id, lessonId } },
      select: { bestScore: true, completed: true },
    })

    const xpEarned = Math.round(lesson.xpReward * (score / 100))
    const newBestScore = Math.max(score, existing?.bestScore ?? 0)
    const wasAlreadyCompleted = existing?.completed ?? false
    const isNowCompleted = score >= 60

    const progress = await db.userProgress.upsert({
      where: { userId_lessonId: { userId: session.user.id, lessonId } },
      create: {
        userId: session.user.id,
        lessonId,
        completed: isNowCompleted,
        attempts: 1,
        bestScore: score,
        xpEarned: isNowCompleted ? xpEarned : 0,
        completedAt: isNowCompleted ? new Date() : null,
      },
      update: {
        attempts: { increment: 1 },
        bestScore: { set: newBestScore },
        ...(isNowCompleted
          ? {
              completed: true,
              xpEarned: { set: Math.max(xpEarned, existing?.bestScore ? Math.round(lesson.xpReward * (existing.bestScore / 100)) : 0) },
              completedAt: wasAlreadyCompleted ? undefined : new Date(),
            }
          : {}),
      },
    })

    // Award XP only on first-time completion to prevent double-award
    let newAchievements: string[] = []
    if (!wasAlreadyCompleted && isNowCompleted) {
      const { achievements } = await awardXP(session.user.id, xpEarned)
      newAchievements = achievements
    }

    return NextResponse.json({
      completed: progress.completed,
      xpEarned: !wasAlreadyCompleted && isNowCompleted ? xpEarned : 0,
      newAchievements,
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 400 })
    }
    console.error('[progress/complete]', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
