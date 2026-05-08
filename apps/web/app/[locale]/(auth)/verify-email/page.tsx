'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Code2, CheckCircle2, XCircle, Mail, Loader2, RefreshCw } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function VerifyEmailPage() {
  const t = useTranslations('auth.verifyEmail')
  const locale = useLocale()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const error = searchParams.get('error')
  const { data: session } = useSession()

  const [resendState, setResendState] = useState<'idle' | 'loading' | 'sent' | 'cooldown'>('idle')

  const handleResend = async () => {
    const email = session?.user?.email
    if (!email) return
    setResendState('loading')
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })
      setResendState(res.status === 429 ? 'cooldown' : 'sent')
    } catch {
      setResendState('idle')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href={`/${locale}`} className="flex items-center justify-center gap-2 font-bold text-xl mb-8 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="gradient-text">CodeNexus</span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl shadow-black/10 text-center space-y-4">
          {success ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold">{t('successTitle')}</h2>
              <p className="text-muted-foreground text-sm">{t('successDesc')}</p>
              <Link
                href={`/${locale}/login`}
                className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                {t('goToLogin')}
              </Link>
            </>
          ) : error ? (
            <>
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-bold">{t('errorTitle')}</h2>
              <p className="text-muted-foreground text-sm">
                {error === 'expired' ? t('errorExpired') : t('errorInvalid')}
              </p>
              <ResendSection state={resendState} onResend={handleResend} hasSession={!!session?.user?.email} t={t} />
              <Link href={`/${locale}/register`} className="text-primary text-sm hover:underline block">
                {t('registerAgain')}
              </Link>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold">{t('pendingTitle')}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{t('pendingDesc')}</p>
              <ResendSection state={resendState} onResend={handleResend} hasSession={!!session?.user?.email} t={t} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ResendSection({
  state,
  onResend,
  hasSession,
  t,
}: {
  state: 'idle' | 'loading' | 'sent' | 'cooldown'
  onResend: () => void
  hasSession: boolean
  t: (key: string) => string
}) {
  if (!hasSession) return null

  if (state === 'sent') {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-green-500 pt-1">
        <CheckCircle2 className="w-4 h-4" />
        {t('resendSent')}
      </div>
    )
  }

  if (state === 'cooldown') {
    return <p className="text-xs text-muted-foreground pt-1">{t('resendCooldown')}</p>
  }

  return (
    <button
      onClick={onResend}
      disabled={state === 'loading'}
      className="flex items-center justify-center gap-2 mx-auto px-5 py-2 rounded-xl border border-border text-sm font-medium hover:bg-accent/40 transition-colors disabled:opacity-60"
    >
      {state === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
      {t('resend')}
    </button>
  )
}
