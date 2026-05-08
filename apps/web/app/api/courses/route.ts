import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lang = searchParams.get('lang')
  const includeSpecializations = searchParams.get('specializations') === 'true'
  const session = await getSession()

  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      ...(lang ? { language: lang as any } : {}),
      ...(includeSpecializations ? {} : { parentCourseId: null }),
    },
    include: {
      _count: { select: { chapters: true } },
      chapters: {
        include: {
          _count: { select: { lessons: true } },
          lessons: {
            where: { type: 'exercise', isPublished: true },
            select: { id: true },
          },
        },
      },
      parentCourse: {
        select: { titleEn: true, titleRu: true },
      },
    },
    orderBy: [{ parentCourseId: 'asc' }, { language: 'asc' }, { level: 'asc' }],
  })

  // Attach completion % for logged-in users
  let progressMap: Record<string, number> = {}
  if (session?.user?.id) {
    const allLessonIds = courses.flatMap((c) =>
      c.chapters.flatMap((ch) => ch.lessons.map((l) => l.id))
    )

    const progress = await db.userProgress.findMany({
      where: { userId: session.user.id, lessonId: { in: allLessonIds }, completed: true },
      select: { lessonId: true },
    })

    const completedSet = new Set(progress.map((p) => p.lessonId))

    for (const course of courses) {
      const total = course.chapters.reduce((sum, ch) => sum + ch._count.lessons, 0)
      if (total === 0) continue
      const completed = course.chapters
        .flatMap((ch) => ch.lessons)
        .filter((l) => completedSet.has(l.id)).length
      progressMap[course.id] = Math.round((completed / total) * 100)
    }
  }

  const result = courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    language: c.language,
    titleEn: c.titleEn,
    titleRu: c.titleRu,
    descriptionEn: c.descriptionEn,
    descriptionRu: c.descriptionRu,
    level: c.level,
    totalXP: c.totalXP,
    isPublished: c.isPublished,
    lessonsCount: c.chapters.reduce((s, ch) => s + ch._count.lessons, 0),
    exercisesCount: c.chapters.reduce((s, ch) => s + ch.lessons.length, 0),
    completionPercent: progressMap[c.id] ?? 0,
    isSpecialization: c.parentCourseId !== null,
    parentTitleEn: c.parentCourse?.titleEn ?? null,
    parentTitleRu: c.parentCourse?.titleRu ?? null,
  }))

  return NextResponse.json(result)
}
