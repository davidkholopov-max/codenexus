export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const locale = req.nextUrl.searchParams.get('locale') ?? 'ru'

  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}/verify-email?error=missing`, req.url))
  }

  const record = await db.emailVerifyToken.findUnique({ where: { token } })

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.redirect(new URL(`/${locale}/verify-email?error=expired`, req.url))
  }

  const [user] = await db.$transaction([
    db.user.update({ where: { id: record.userId }, data: { emailVerified: true }, select: { email: true, name: true } }),
    db.emailVerifyToken.delete({ where: { id: record.id } }),
  ])

  sendWelcomeEmail(user.email, user.name, locale).catch((err) =>
    console.error('[verify-email] Failed to send welcome email:', err)
  )

  return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url))
}
