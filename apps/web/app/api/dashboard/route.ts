export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await requireAuth()
    const userId = session.user.id

    const [user, allAchievements, userAchievements, recentProgress] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      }),
      db.achievement.findMany({ orderBy: { rarity: 'asc' } }),
      db.userAchievement.findMany({
        where: { userId },
        select: { achievementId: true, earnedAt: true },
      }),
      db.userProgress.findMany({
        where: { userId, completed: true },
        orderBy: { completedAt: 'desc' },
        take: 10,
        include: {
          lesson: {
            select: {
              titleEn: true,
              titleRu: true,
              xpReward: true,
              chapter: {
                select: {
                  course: { select: { id: true, slug: true, titleEn: true, titleRu: true, language: true } },
                },
              },
            },
          },
        },
      }),
    ])

    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

    // Count completed courses
    const completedCourseIds = new Set(
      recentProgress.map((p) => p.lesson.chapter.course.id)
    )

    // Build achievement list with earned status
    const earnedMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua.earnedAt]))
    const achievements = allAchievements.map((ach) => ({
      slug: ach.slug,
      icon: ach.icon,
      titleEn: ach.titleEn,
      titleRu: ach.titleRu,
      rarity: ach.rarity,
      earned: earnedMap.has(ach.id),
      earnedAt: earnedMap.get(ach.id)?.toISOString() ?? null,
    }))

    // Get current course progress
    const preferredLang = user.profile?.preferredLanguage ?? 'python'
    const currentCourse = await db.course.findFirst({
      where: { language: preferredLang as any, isPublished: true, parentCourseId: null },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: 'asc' },
              select: { id: true, slug: true, titleEn: true, titleRu: true },
            },
          },
        },
      },
    })

    let currentCourseData = null
    if (currentCourse) {
      const allLessons = currentCourse.chapters.flatMap((ch) => ch.lessons)
      const completedIds = new Set(
        (
          await db.userProgress.findMany({
            where: { userId, lessonId: { in: allLessons.map((l) => l.id) }, completed: true },
            select: { lessonId: true },
          })
        ).map((p) => p.lessonId)
      )
      const progress = allLessons.length
        ? Math.round((completedIds.size / allLessons.length) * 100)
        : 0
      const nextLesson = allLessons.find((l) => !completedIds.has(l.id)) ?? null

      currentCourseData = {
        slug: currentCourse.slug,
        titleEn: currentCourse.titleEn,
        titleRu: currentCourse.titleRu,
        progress,
        nextLesson,
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        xp: user.xp,
        streak: user.streak,
        coursesCompleted: completedCourseIds.size,
      },
      currentCourse: currentCourseData,
      recentActivity: recentProgress.map((p) => ({
        lessonTitleEn: p.lesson.titleEn,
        lessonTitleRu: p.lesson.titleRu,
        completedAt: p.completedAt?.toISOString() ?? '',
        xpEarned: p.xpEarned,
      })),
      achievements,
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    console.error('[dashboard]', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
