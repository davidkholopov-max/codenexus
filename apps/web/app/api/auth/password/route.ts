export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/session'
import bcrypt from 'bcryptjs'

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth()
    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    })

    if (!user?.passwordHash) {
      return NextResponse.json(
        { message: 'Password change not available for OAuth accounts' },
        { status: 400 }
      )
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 })
    }

    const sameAsOld = await bcrypt.compare(newPassword, user.passwordHash)
    if (sameAsOld) {
      return NextResponse.json({ message: 'New password must be different from the current one' }, { status: 400 })
    }

    const hash = await bcrypt.hash(newPassword, 12)
    await db.user.update({
      where: { id: session.user.id },
      data: { passwordHash: hash },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
