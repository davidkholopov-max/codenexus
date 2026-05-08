export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()

  const top = await db.user.findMany({
    where: { xp: { gt: 0 } },
    orderBy: { xp: 'desc' },
    take: 50,
    select: {
      id: true,
      name: true,
      avatar: true,
      xp: true,
      streak: true,
      createdAt: true,
      profile: { select: { preferredLanguage: true, country: true } },
    },
  })

  const rows = top.map((u, i) => ({
    rank: i + 1,
    id: u.id,
    name: u.name,
    avatar: u.avatar,
    xp: u.xp,
    streak: u.streak,
    preferredLanguage: u.profile?.preferredLanguage ?? 'python',
    country: u.profile?.country ?? null,
    isCurrentUser: session?.user?.id === u.id,
  }))

  // If current user isn't in top 50, fetch their rank
  let currentUserRank = null
  if (session?.user?.id && !rows.find((r) => r.isCurrentUser)) {
    const userXP = (await db.user.findUnique({ where: { id: session.user.id }, select: { xp: true } }))?.xp ?? 0
    const rank = (await db.user.count({ where: { xp: { gt: userXP } } })) + 1
    currentUserRank = { rank, xp: userXP }
  }

  return NextResponse.json({ rows, currentUserRank })
}
