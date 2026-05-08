'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { CourseSidebar } from './CourseSidebar'
import { LessonPlayerConnected } from './LessonPlayerConnected'
import { cn } from '@/lib/utils'

interface Lesson {
  id: string
  slug: string
  type: 'theory' | 'exercise' | 'quiz'
  titleEn: string
  titleRu: string
  xpReward: number
  estimatedMin: number
  completed: boolean
}

interface Chapter {
  id: string
  slug: string
  titleEn: string
  titleRu: string
  order: number
  lessons: Lesson[]
}

interface CourseLearnerProps {
  chapters: Chapter[]
  activeLesson: Lesson | null
  courseSlug: string
  locale: string
}

export function CourseLearner({ chapters, activeLesson, courseSlug, locale }: CourseLearnerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const allLessons = chapters.flatMap((ch) => ch.lessons)
  const currentIdx = activeLesson ? allLessons.findIndex((l) => l.id === activeLesson.id) : -1
  const nextLessonSlug = currentIdx >= 0 && currentIdx < allLessons.length - 1
    ? allLessons[currentIdx + 1].slug
    : undefined

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed bottom-4 left-4 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        aria-label="Open course navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always visible on desktop, drawer on mobile */}
      <div
        className={cn(
          'fixed md:relative inset-y-0 left-0 z-50 md:z-auto',
          'transition-transform duration-300 md:transition-none md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 z-10 p-1 rounded-md text-muted-foreground hover:text-foreground"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
        <CourseSidebar
          chapters={chapters}
          courseSlug={courseSlug}
          activeLessonSlug={activeLesson?.slug ?? ''}
          locale={locale}
          onLessonClick={() => setSidebarOpen(false)}
        />
      </div>

      <main className="flex-1 overflow-y-auto min-w-0">
        {activeLesson ? (
          <LessonPlayerConnected
            lessonId={activeLesson.id}
            locale={locale}
            courseSlug={courseSlug}
            nextLessonSlug={nextLessonSlug}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a lesson to begin
          </div>
        )}
      </main>
    </>
  )
}
