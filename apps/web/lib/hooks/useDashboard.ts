'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface DashboardData {
  user: {
    id: string
    name: string
    xp: number
    streak: number
    coursesCompleted: number
  }
  currentCourse: {
    slug: string
    titleEn: string
    titleRu: string
    progress: number
    nextLesson: { id: string; slug: string; titleEn: string; titleRu: string } | null
  } | null
  recentActivity: Array<{
    lessonTitleEn: string
    lessonTitleRu: string
    completedAt: string
    xpEarned: number
  }>
  achievements: Array<{
    slug: string
    icon: string
    titleEn: string
    titleRu: string
    rarity: string
    earned: boolean
    earnedAt: string | null
  }>
}

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => axios.get('/api/dashboard').then((r) => r.data),
    staleTime: 30_000,
  })
}
