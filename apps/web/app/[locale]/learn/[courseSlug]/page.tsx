import { Navbar } from '@/components/layout/Navbar'
import { CourseLearner } from '@/components/course/CourseLearner'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://codenexus.app'

export async function generateMetadata({
  params: { locale, courseSlug },
}: {
  params: { locale: string; courseSlug: string }
}): Promise<Metadata> {
  const course = await db.course.findUnique({
    where: { slug: courseSlug, isPublished: true },
    select: { titleEn: true, titleRu: true, descriptionEn: true, descriptionRu: true, language: true },
  })
  if (!course) return {}

  const isRu = locale === 'ru'
  const title = isRu ? course.titleRu : course.titleEn
  const description = isRu ? course.descriptionRu : course.descriptionEn
  const ogImage = `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}&lang=${course.language}`

  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  }
}

export default async function CourseLearnPage({
  params: { locale, courseSlug },
  searchParams,
}: {
  params: { locale: string; courseSlug: string }
  searchParams: { lesson?: string }
}) {
  const session = await getSession()

  const course = await db.course.findUnique({
    where: { slug: courseSlug, isPublished: true },
    include: {
      chapters: {
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

  if (!course) notFound()

  // Fetch user progress
  let completedIds = new Set<string>()
  if (session?.user?.id) {
    const allIds = course.chapters.flatMap((ch) => ch.lessons.map((l) => l.id))
    const progress = await db.userProgress.findMany({
      where: { userId: session.user.id, lessonId: { in: allIds }, completed: true },
      select: { lessonId: true },
    })
    completedIds = new Set(progress.map((p) => p.lessonId))
  }

  const chapters = course.chapters.map((ch) => ({
    ...ch,
    lessons: ch.lessons.map((l) => ({ ...l, completed: completedIds.has(l.id) })),
  }))

  // Determine active lesson
  const allLessons = chapters.flatMap((ch) => ch.lessons)
  const firstIncomplete = allLessons.find((l) => !l.completed)
  const activeLessonSlug =
    searchParams.lesson ?? firstIncomplete?.slug ?? allLessons[0]?.slug

  const activeLesson = allLessons.find((l) => l.slug === activeLessonSlug)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16 overflow-hidden">
        <CourseLearner
          chapters={chapters}
          activeLesson={activeLesson ?? null}
          courseSlug={courseSlug}
          locale={locale}
        />
      </div>
    </div>
  )
}
