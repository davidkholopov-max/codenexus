import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'

const schema = z.object({
  email: z.string().email(),
  locale: z.string().default('ru'),
})

export async function POST(req: NextRequest) {
  try {
    const { email, locale } = schema.parse(await req.json())

    const user = await db.user.findUnique({ where: { email } })

    // Always return success — don't reveal whether email exists
    if (!user || !user.passwordHash) {
      return NextResponse.json({ ok: true })
    }

    // Invalidate old tokens
    await db.passwordResetToken.deleteMany({ where: { userId: user.id } })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await db.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    })

    await sendPasswordResetEmail(email, token, locale)

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid email' }, { status: 400 })
    }
    console.error('[forgot-password]', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
