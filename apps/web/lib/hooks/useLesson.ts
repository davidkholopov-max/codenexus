'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export interface Exercise {
  id: string
  instructionsEn: string
  instructionsRu: string
  starterCode: string
  language: string
  timeoutMs: number
  testCases: Array<{ input: string; expectedOutput: string; isHidden: boolean }>
  hints: Array<{ order: number; textEn: string; textRu: string }>
}

export interface QuizItem {
  id: string
  order: number
  questionEn: string
  questionRu: string
  options: Array<{ textEn: string; textRu: string; isCorrect?: boolean }>
}

export interface LessonFull {
  id: string
  slug: string
  type: 'theory' | 'exercise' | 'quiz'
  titleEn: string
  titleRu: string
  contentEn: string
  contentRu: string
  xpReward: number
  estimatedMin: number
  exercise: Exercise | null
  quizItems: QuizItem[]
  userProgress: { completed: boolean; attempts: number; bestScore: number } | null
}

export function useLesson(lessonId: string | undefined) {
  return useQuery<LessonFull>({
    queryKey: ['lesson', lessonId],
    queryFn: () => axios.get(`/api/lessons/${lessonId}`).then((r) => r.data),
    enabled: !!lessonId,
    staleTime: 300_000,
  })
}

export function useCompleteLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ lessonId, score }: { lessonId: string; score?: number }) =>
      axios
        .post('/api/progress/complete', { lessonId, score: score ?? 100 })
        .then((r) => r.data),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] })
      queryClient.invalidateQueries({ queryKey: ['course'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
