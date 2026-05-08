import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Защита: принимаем только запросы с секретным ключом
const CRON_SECRET = process.env.CRON_SECRET

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000)

  const { count } = await db.user.deleteMany({
    where: {
      emailVerified: false,
      createdAt: { lt: cutoff },
    },
  })

  console.log(`[cron/cleanup] Deleted ${count} unverified accounts older than 48h`)
  return NextResponse.json({ deleted: count })
}
