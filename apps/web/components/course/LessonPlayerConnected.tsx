'use client'

import { useLesson, useCompleteLesson } from '@/lib/hooks/useLesson'
import { LessonPlayer } from './LessonPlayer'
import { Loader2 } from 'lucide-react'

interface LessonPlayerConnectedProps {
  lessonId: string
  locale: string
  courseSlug: string
  nextLessonSlug?: string
}

export function LessonPlayerConnected({ lessonId, locale, courseSlug, nextLessonSlug }: LessonPlayerConnectedProps) {
  const { data: lesson, isLoading, error } = useLesson(lessonId)
  const { mutate: complete } = useCompleteLesson()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Failed to load lesson. Please try again.
      </div>
    )
  }

  const handleComplete = (score?: number) => {
    complete({ lessonId: lesson.id, score })
  }

  return (
    <LessonPlayer
      lesson={lesson}
      locale={locale}
      courseSlug={courseSlug}
      onComplete={handleComplete}
      nextLessonSlug={nextLessonSlug}
    />
  )
}
