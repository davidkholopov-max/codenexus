export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getSession()

  const course = await db.course.findUnique({
    where: { slug: params.slug, isPublished: true },
    include: {
      chapters: {
        where: {},
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { order: 'asc' },
            select: {
              id: true,
              slug: true,
              type: true,
              titleEn: true,
              titleRu: true,
              xpReward: true,
              estimatedMin: true,
            },
          },
        },
      },
    },
  })

  if (!course) {
    return NextResponse.json({ message: 'Course not found' }, { status: 404 })
  }

  // Attach completion status for authenticated users
  let completedLessonIds = new Set<string>()
  if (session?.user?.id) {
    const allIds = course.chapters.flatMap((ch) => ch.lessons.map((l) => l.id))
    const progress = await db.userProgress.findMany({
      where: { userId: session.user.id, lessonId: { in: allIds }, completed: true },
      select: { lessonId: true },
    })
    completedLessonIds = new Set(progress.map((p) => p.lessonId))
  }

  const chapters = course.chapters.map((ch) => ({
    id: ch.id,
    slug: ch.slug,
    titleEn: ch.titleEn,
    titleRu: ch.titleRu,
    order: ch.order,
    lessons: ch.lessons.map((l) => ({
      ...l,
      completed: completedLessonIds.has(l.id),
    })),
  }))

  return NextResponse.json({ ...course, chapters })
}
