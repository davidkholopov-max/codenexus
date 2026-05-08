export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/email'

const schema = z.object({
  email: z.string().email(),
  locale: z.string().default('ru'),
})

// Cooldown: one resend per 2 minutes
const COOLDOWN_MS = 2 * 60 * 1000

export async function POST(req: NextRequest) {
  try {
    const { email, locale } = schema.parse(await req.json())

    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, emailVerified: true },
    })

    // Always return 200 to prevent email enumeration
    if (!user || user.emailVerified) {
      return NextResponse.json({ ok: true })
    }

    // Check cooldown: block if a token was created recently
    const recent = await db.emailVerifyToken.findFirst({
      where: {
        userId: user.id,
        createdAt: { gte: new Date(Date.now() - COOLDOWN_MS) },
      },
    })
    if (recent) {
      return NextResponse.json({ code: 'cooldown' }, { status: 429 })
    }

    // Delete old tokens for this user and create a fresh one
    await db.emailVerifyToken.deleteMany({ where: { userId: user.id } })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await db.emailVerifyToken.create({ data: { userId: user.id, token, expiresAt } })
    await sendVerificationEmail(email, token, locale)

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 400 })
    }
    console.error('[resend-verification]', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
