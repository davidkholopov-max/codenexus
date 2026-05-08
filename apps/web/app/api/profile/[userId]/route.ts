import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(
  _req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getSession()
  const isOwn = session?.user?.id === params.userId

  const user = await db.user.findUnique({
    where: { id: params.userId },
    include: {
      profile: true,
      achievements: {
        include: { achievement: true },
        orderBy: { earnedAt: 'desc' },
      },
      progress: {
        where: { completed: true },
        orderBy: { completedAt: 'desc' },
        take: 20,
        include: {
          lesson: {
            select: {
              titleEn: true,
              titleRu: true,
              xpReward: true,
              chapter: {
                select: {
                  course: { select: { language: true, slug: true, titleEn: true, titleRu: true } },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

  // Aggregate stats
  const totalLessons = user.progress.length
  const totalXPFromProgress = user.progress.reduce((sum, p) => sum + p.xpEarned, 0)

  // Unique courses touched
  const courseSet = new Set(
    user.progress.map((p) => p.lesson.chapter.course.slug)
  )

  return NextResponse.json({
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    xp: user.xp,
    streak: user.streak,
    createdAt: user.createdAt,
    bio: user.profile?.bio ?? null,
    country: user.profile?.country ?? null,
    preferredLanguage: user.profile?.preferredLanguage ?? 'python',
    stats: {
      totalLessons,
      coursesStarted: courseSet.size,
      achievementsEarned: user.achievements.length,
    },
    achievements: user.achievements.map((ua) => ({
      slug: ua.achievement.slug,
      icon: ua.achievement.icon,
      titleEn: ua.achievement.titleEn,
      titleRu: ua.achievement.titleRu,
      rarity: ua.achievement.rarity,
      earnedAt: ua.earnedAt,
    })),
    recentActivity: user.progress.slice(0, 10).map((p) => ({
      lessonTitleEn: p.lesson.titleEn,
      lessonTitleRu: p.lesson.titleRu,
      courseSlug: p.lesson.chapter.course.slug,
      courseTitleEn: p.lesson.chapter.course.titleEn,
      language: p.lesson.chapter.course.language,
      xpEarned: p.xpEarned,
      completedAt: p.completedAt,
    })),
  })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getSession()
  if (!session || session.user.id !== params.userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { name, bio, country } = await req.json()

  await db.user.update({
    where: { id: params.userId },
    data: { ...(name ? { name } : {}) },
  })

  await db.userProfile.upsert({
    where: { userId: params.userId },
    create: { userId: params.userId, bio, country },
    update: { bio, country },
  })

  return NextResponse.json({ ok: true })
}
