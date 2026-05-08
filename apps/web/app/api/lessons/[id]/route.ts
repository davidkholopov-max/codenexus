import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession()

  const lesson = await db.lesson.findUnique({
    where: { id: params.id, isPublished: true },
    include: {
      exercise: true,
      quizItems: { orderBy: { order: 'asc' } },
      chapter: {
        select: {
          id: true,
          slug: true,
          course: { select: { id: true, slug: true, language: true } },
        },
      },
    },
  })

  if (!lesson) {
    return NextResponse.json({ message: 'Lesson not found' }, { status: 404 })
  }

  // Strip hidden test cases from exercise (they'll only be sent to the compiler)
  const safeExercise = lesson.exercise
    ? {
        ...lesson.exercise,
        testCases: (lesson.exercise.testCases as any[]).filter((tc) => !tc.isHidden),
        solutionCode: undefined, // Never expose solution to client
      }
    : null

  // Keep quiz options as-is (isCorrect needed by client for answer checking)
  const safeQuizItems = lesson.quizItems

  let userProgress = null
  if (session?.user?.id) {
    userProgress = await db.userProgress.findUnique({
      where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
      select: { completed: true, attempts: true, bestScore: true },
    })
  }

  return NextResponse.json({
    ...lesson,
    exercise: safeExercise,
    quizItems: safeQuizItems,
    userProgress,
  })
}
