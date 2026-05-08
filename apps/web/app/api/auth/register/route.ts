import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { z } from 'zod'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/email'

const schema = z.object({
  name: z.string().min(2).max(64),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  locale: z.string().default('ru'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, locale } = schema.parse(body)

    // Clean up dead unverified accounts older than 48 hours (fire-and-forget)
    db.user.deleteMany({
      where: {
        emailVerified: false,
        createdAt: { lt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
      },
    }).catch(() => { /* non-critical */ })

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        profile: {
          create: {
            locale,
            theme: 'dark',
            preferredLanguage: 'python',
            dailyGoalMinutes: 30,
          },
        },
      },
      select: { id: true, email: true, name: true },
    })

    // Send verification email (non-blocking — don't fail registration if email fails)
    try {
      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      await db.emailVerifyToken.create({ data: { userId: user.id, token, expiresAt } })
      await sendVerificationEmail(email, token, locale)
    } catch (emailErr) {
      console.error('[register] Failed to send verification email:', emailErr)
    }

    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 400 })
    }
    console.error('[register]', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
