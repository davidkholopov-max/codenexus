'use client'

import { useEffect, useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Navbar } from '@/components/layout/Navbar'
import { CourseCard } from '@/components/course/CourseCard'
import { Search, SlidersHorizontal } from 'lucide-react'
import { LANGUAGE_ICONS } from '@/lib/utils'
import { cn } from '@/lib/utils'
import axios from 'axios'

interface Course {
  id: string
  slug: string
  language: string
  titleEn: string
  titleRu: string
  descriptionEn: string
  descriptionRu: string
  level: number
  totalXP: number
  isPublished: boolean
  lessonsCount: number
  exercisesCount: number
  completionPercent: number
  isSpecialization: boolean
  parentTitleEn: string | null | undefined
  parentTitleRu: string | null | undefined
}

const LANG_FILTERS = [
  { value: 'all', label: 'All', icon: '🌐' },
  { value: 'python', label: 'Python', icon: LANGUAGE_ICONS.python },
  { value: 'javascript', label: 'JavaScript', icon: LANGUAGE_ICONS.javascript },
  { value: 'html', label: 'HTML/CSS', icon: LANGUAGE_ICONS.html },
  { value: 'sql', label: 'SQL', icon: LANGUAGE_ICONS.sql },
  { value: 'go', label: 'Go', icon: LANGUAGE_ICONS.go },
  { value: 'java', label: 'Java', icon: LANGUAGE_ICONS.java },
  { value: 'cpp', label: 'C++', icon: LANGUAGE_ICONS.cpp },
]

const LEVEL_LABELS: Record<number, string> = {
  0: 'Intro',
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
}

export default function CoursesPage() {
  const t = useTranslations('courses')
  const locale = useLocale()
  const isRu = locale === 'ru'

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [langFilter, setLangFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState<number | 'all'>('all')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showSpecializations, setShowSpecializations] = useState(false)

  useEffect(() => {
    axios.get('/api/courses?specializations=true').then((r) => setCourses(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (c.isSpecialization !== showSpecializations) return false
      if (langFilter !== 'all' && c.language !== langFilter) return false
      if (levelFilter !== 'all' && c.level !== levelFilter) return false
      if (search) {
        const q = search.toLowerCase()
        const title = isRu ? c.titleRu : c.titleEn
        const desc = isRu ? c.descriptionRu : c.descriptionEn
        if (!title.toLowerCase().includes(q) && !desc.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [courses, langFilter, levelFilter, search, isRu, showSpecializations])

  const inProgress = filtered.filter((c) => c.completionPercent > 0 && c.completionPercent < 100)
  const notStarted = filtered.filter((c) => c.completionPercent === 0)
  const completed = filtered.filter((c) => c.completionPercent === 100)

  const specializationsCount = courses.filter((c) => c.isSpecialization).length

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground mb-5">{t('subtitle')}</p>

          {/* Course / Specialization toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-muted border border-border">
            <button
              onClick={() => setShowSpecializations(false)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                !showSpecializations ? 'bg-card shadow-sm text-foreground border border-border' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('title')}
            </button>
            <button
              onClick={() => setShowSpecializations(true)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                showSpecializations ? 'bg-card shadow-sm text-foreground border border-border' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Specializations
              {specializationsCount > 0 && (
                <span className="text-[10px] font-bold bg-purple-500/15 text-purple-500 px-1.5 py-0.5 rounded-full">
                  {specializationsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search + filter toggle */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('filter.all')}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors',
              showFilters ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-accent/50'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Language filter pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {LANG_FILTERS.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setLangFilter(value)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-200',
                langFilter === value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/30'
              )}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Level filter */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-6 p-4 rounded-2xl bg-card border border-border">
            <span className="text-sm font-medium text-muted-foreground mr-2 self-center">Level:</span>
            {(['all', 0, 1, 2, 3, 4] as const).map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={cn(
                  'px-3 py-1 rounded-lg text-sm font-medium border transition-all',
                  levelFilter === level
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:bg-accent/50'
                )}
              >
                {level === 'all' ? 'All Levels' : LEVEL_LABELS[level]}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card animate-pulse h-72" />
            ))}
          </div>
        ) : (
          <>
            {/* In progress */}
            {inProgress.length > 0 && (
              <section className="mb-8">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                  Continue Learning
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgress.map((c) => <CourseCard key={c.id} course={c} locale={locale} />)}
                </div>
              </section>
            )}

            {/* Not started */}
            {notStarted.length > 0 && (
              <section className="mb-8">
                {inProgress.length > 0 && (
                  <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" />
                    Start a New Course
                  </h2>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notStarted.map((c) => <CourseCard key={c.id} course={c} locale={locale} />)}
                </div>
              </section>
            )}

            {/* Completed */}
            {completed.length > 0 && (
              <section className="mb-8">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  Completed
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completed.map((c) => <CourseCard key={c.id} course={c} locale={locale} />)}
                </div>
              </section>
            )}

            {filtered.length === 0 && (
              <div className="py-20 text-center text-muted-foreground">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-medium">No courses match your filters.</p>
                <button
                  onClick={() => { setLangFilter('all'); setLevelFilter('all'); setSearch('') }}
                  className="mt-3 text-primary text-sm hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
