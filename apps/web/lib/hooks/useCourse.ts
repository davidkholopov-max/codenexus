'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface LessonMeta {
  id: string
  slug: string
  type: 'theory' | 'exercise' | 'quiz'
  titleEn: string
  titleRu: string
  xpReward: number
  estimatedMin: number
  completed: boolean
}

export interface Chapter {
  id: string
  slug: string
  titleEn: string
  titleRu: string
  order: number
  lessons: LessonMeta[]
}

export interface CourseDetail {
  id: string
  slug: string
  language: string
  titleEn: string
  titleRu: string
  totalXP: number
  chapters: Chapter[]
}

export function useCourse(slug: string) {
  return useQuery<CourseDetail>({
    queryKey: ['course', slug],
    queryFn: () => axios.get(`/api/courses/${slug}`).then((r) => r.data),
    staleTime: 60_000,
  })
}
