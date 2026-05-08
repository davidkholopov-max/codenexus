'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { motion } from 'framer-motion'
import { Zap, Flame, BookOpen, Trophy, Calendar, Edit2, Check, X, Loader2 } from 'lucide-react'
import { LANGUAGE_ICONS } from '@/lib/utils'
import { cn } from '@/lib/utils'
import axios from 'axios'

interface ProfileData {
  id: string
  name: string
  avatar: string | null
  xp: number
  streak: number
  createdAt: string
  bio: string | null
  country: string | null
  preferredLanguage: string
  stats: { totalLessons: number; coursesStarted: number; achievementsEarned: number }
  achievements: { slug: string; icon: string; titleEn: string; titleRu: string; rarity: string; earnedAt: string }[]
  recentActivity: { lessonTitleEn: string; lessonTitleRu: string; courseSlug: string; language: string; xpEarned: number; completedAt: string }[]
}

const RARITY_COLORS: Record<string, string> = {
  common: 'border-border',
  rare: 'border-blue-500/40 bg-blue-500/5',
  epic: 'border-purple-500/40 bg-purple-500/5',
  legendary: 'border-amber-500/40 bg-amber-500/5',
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const t = useTranslations('profile')
  const locale = useLocale()
  const router = useRouter()
  const isRu = locale === 'ru'

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editCountry, setEditCountry] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push(`/${locale}/login`)
  }, [status])

  useEffect(() => {
    if (!session?.user?.id) return
    axios.get(`/api/profile/${session.user.id}`)
      .then((r) => {
        setProfile(r.data)
        setEditName(r.data.name)
        setEditBio(r.data.bio ?? '')
        setEditCountry(r.data.country ?? '')
      })
      .finally(() => setLoading(false))
  }, [session?.user?.id])

  const handleSave = async () => {
    if (!session?.user?.id) return
    setSaving(true)
    await axios.patch(`/api/profile/${session.user.id}`, {
      name: editName,
      bio: editBio,
      country: editCountry,
    })
    setProfile((p) => p ? { ...p, name: editName, bio: editBio, country: editCountry } : p)
    setEditing(false)
    setSaving(false)
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
    year: 'numeric', month: 'long',
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-3xl font-bold shrink-0">
              {profile.avatar
                ? <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-2xl object-cover" />
                : profile.name[0].toUpperCase()
              }
            </div>

            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-3">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-lg font-bold outline-none focus:border-primary"
                    placeholder="Your name"
                  />
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary resize-none"
                    placeholder={t('bio')}
                  />
                  <input
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary"
                    placeholder={t('country')}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60"
                    >
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      Save
                    </button>
                    <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-1.5 rounded-xl border border-border text-sm">
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold">{profile.name}</h1>
                    <button
                      onClick={() => setEditing(true)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  {profile.bio && <p className="text-muted-foreground text-sm mb-2">{profile.bio}</p>}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {profile.country && <span>📍 {profile.country}</span>}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {t('joinedDate')}: {joinDate}
                    </span>
                    <span>
                      {LANGUAGE_ICONS[profile.preferredLanguage] ?? '💻'}{' '}
                      <span className="capitalize">{profile.preferredLanguage}</span>
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            {[
              { icon: Zap, label: 'XP', value: profile.xp.toLocaleString(), color: 'text-amber-500' },
              { icon: Flame, label: t('stats'), value: `${profile.streak}d 🔥`, color: 'text-orange-500' },
              { icon: BookOpen, label: 'Lessons', value: profile.stats.totalLessons, color: 'text-blue-500' },
              { icon: Trophy, label: t('achievements'), value: profile.stats.achievementsEarned, color: 'text-purple-500' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="text-center">
                <Icon className={cn('w-5 h-5 mx-auto mb-1', color)} />
                <div className="font-bold text-lg">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Achievements */}
          <div className="md:col-span-2">
            <h2 className="font-semibold text-lg mb-4">{t('achievements')}</h2>
            {profile.achievements.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">
                No achievements yet. Complete lessons to earn them!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {profile.achievements.map((ach) => (
                  <motion.div
                    key={ach.slug}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-2xl border text-center',
                      RARITY_COLORS[ach.rarity] ?? 'border-border'
                    )}
                  >
                    <span className="text-3xl">{ach.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">{isRu ? ach.titleRu : ach.titleEn}</div>
                      <div className="text-[10px] text-muted-foreground capitalize mt-0.5">{ach.rarity}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="font-semibold text-lg mb-4">{t('activity')}</h2>
            <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
              {profile.recentActivity.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">No activity yet.</div>
              ) : (
                profile.recentActivity.map((act, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-3">
                    <span className="text-lg shrink-0">{LANGUAGE_ICONS[act.language] ?? '📄'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {isRu ? act.lessonTitleRu : act.lessonTitleEn}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {act.completedAt ? new Date(act.completedAt).toLocaleDateString() : ''}
                      </div>
                    </div>
                    <span className="xp-badge shrink-0">+{act.xpEarned}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
