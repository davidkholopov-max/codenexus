export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  try {
    const { token, password } = schema.parse(await req.json())

    const record = await db.passwordResetToken.findUnique({ where: { token } })

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return NextResponse.json(
        { code: 'invalid_token' },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await db.$transaction([
      db.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      db.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 400 })
    }
    console.error('[reset-password]', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
