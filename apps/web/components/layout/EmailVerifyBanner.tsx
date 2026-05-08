'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale } from 'next-intl'
import { Mail, X, Loader2, CheckCircle2 } from 'lucide-react'

export function EmailVerifyBanner() {
  const { data: session } = useSession()
  const locale = useLocale()
  const isRu = locale === 'ru'
  const [dismissed, setDismissed] = useState(false)
  const [resendState, setResendState] = useState<'idle' | 'loading' | 'sent' | 'cooldown'>('idle')

  // Only show for logged-in users with unverified email
  if (!session?.user || session.user.emailVerified || dismissed) return null

  const handleResend = async () => {
    if (!session.user.email) return
    setResendState('loading')
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, locale }),
      })
      setResendState(res.status === 429 ? 'cooldown' : 'sent')
    } catch {
      setResendState('idle')
    }
  }

  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5">
      <div className="max-w-5xl mx-auto flex items-center gap-3 flex-wrap">
        <Mail className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="text-sm text-amber-200 flex-1">
          {isRu
            ? 'Подтверди email — мы отправили письмо при регистрации.'
            : 'Please verify your email — we sent you a link when you signed up.'}
        </span>

        {resendState === 'sent' ? (
          <span className="flex items-center gap-1.5 text-xs text-green-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isRu ? 'Письмо отправлено!' : 'Email sent!'}
          </span>
        ) : resendState === 'cooldown' ? (
          <span className="text-xs text-muted-foreground">
            {isRu ? 'Подождите 2 минуты' : 'Wait 2 minutes'}
          </span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resendState === 'loading'}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2 disabled:opacity-60 flex items-center gap-1"
          >
            {resendState === 'loading' && <Loader2 className="w-3 h-3 animate-spin" />}
            {isRu ? 'Отправить повторно' : 'Resend email'}
          </button>
        )}

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="text-muted-foreground hover:text-foreground transition-colors ml-auto"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
