'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Navbar } from '@/components/layout/Navbar'
import { motion } from 'framer-motion'
import { Trophy, Flame, Zap, Medal } from 'lucide-react'
import { LANGUAGE_ICONS } from '@/lib/utils'
import { cn } from '@/lib/utils'
import axios from 'axios'

interface LeaderRow {
  rank: number
  id: string
  name: string
  avatar: string | null
  xp: number
  streak: number
  preferredLanguage: string
  country: string | null
  isCurrentUser: boolean
}

const RANK_STYLES: Record<number, { bg: string; icon: string; text: string }> = {
  1: { bg: 'bg-amber-500/10 border-amber-500/30', icon: '🥇', text: 'text-amber-500' },
  2: { bg: 'bg-slate-400/10 border-slate-400/30', icon: '🥈', text: 'text-slate-400' },
  3: { bg: 'bg-amber-700/10 border-amber-700/30', icon: '🥉', text: 'text-amber-700' },
}

export default function LeaderboardPage() {
  const locale = useLocale()
  const [rows, setRows] = useState<LeaderRow[]>([])
  const [currentUserRank, setCurrentUserRank] = useState<{ rank: number; xp: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/leaderboard').then((r) => {
      setRows(r.data.rows)
      setCurrentUserRank(r.data.currentUserRank)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">Top learners on CodeNexus this month</p>
        </div>

        {/* Top 3 podium */}
        {rows.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[rows[1], rows[0], rows[2]].map((row, i) => {
              const pos = i === 0 ? 2 : i === 1 ? 1 : 3
              const style = RANK_STYLES[pos]
              return (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    'flex flex-col items-center p-4 rounded-2xl border text-center',
                    style.bg,
                    i === 1 ? 'scale-105 shadow-lg' : '',
                    row.isCurrentUser && 'ring-2 ring-primary'
                  )}
                >
                  <span className="text-3xl mb-2">{style.icon}</span>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-lg font-bold mb-2">
                    {row.avatar
                      ? <img src={row.avatar} className="w-full h-full rounded-xl object-cover" alt="" />
                      : row.name[0].toUpperCase()
                    }
                  </div>
                  <div className="font-semibold text-sm truncate w-full">{row.name}</div>
                  <div className={cn('font-bold text-lg', style.text)}>{row.xp.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">XP</div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Full list */}
        <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                <div className="w-8 h-4 bg-muted rounded" />
                <div className="w-10 h-10 bg-muted rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-3 bg-muted rounded" />
                  <div className="w-20 h-2 bg-muted rounded" />
                </div>
              </div>
            ))
          ) : rows.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              No learners yet. Be the first!
            </div>
          ) : (
            rows.map((row, i) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  'px-5 py-4 flex items-center gap-4 transition-colors',
                  row.isCurrentUser ? 'bg-primary/5' : 'hover:bg-accent/30'
                )}
              >
                {/* Rank */}
                <div className={cn('w-8 text-center font-bold text-sm shrink-0', row.rank <= 3 ? 'text-amber-500' : 'text-muted-foreground')}>
                  {row.rank <= 3 ? ['🥇', '🥈', '🥉'][row.rank - 1] : `#${row.rank}`}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center font-bold shrink-0">
                  {row.avatar
                    ? <img src={row.avatar} className="w-full h-full rounded-xl object-cover" alt="" />
                    : row.name[0].toUpperCase()
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate">{row.name}</span>
                    {row.isCurrentUser && (
                      <span className="text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded-full">You</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{LANGUAGE_ICONS[row.preferredLanguage] ?? '💻'}</span>
                    {row.streak > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-orange-500" />
                        {row.streak}d
                      </span>
                    )}
                    {row.country && <span>📍 {row.country}</span>}
                  </div>
                </div>

                {/* XP */}
                <div className="text-right shrink-0">
                  <div className="font-bold text-sm">{row.xp.toLocaleString()}</div>
                  <div className="text-[10px] text-amber-500">XP</div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Current user rank if outside top 50 */}
        {currentUserRank && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-2xl border border-primary/20 bg-primary/5 flex items-center gap-4"
          >
            <Medal className="w-5 h-5 text-primary shrink-0" />
            <span className="text-sm">
              Your rank: <strong>#{currentUserRank.rank}</strong> with <strong>{currentUserRank.xp} XP</strong>
            </span>
          </motion.div>
        )}
      </main>
    </div>
  )
}
