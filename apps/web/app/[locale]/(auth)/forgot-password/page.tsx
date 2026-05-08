'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Code2, Loader2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'

const schema = z.object({ email: z.string().email() })
type Form = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgotPassword')
  const locale = useLocale()
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: Form) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, locale }),
      })
      if (res.ok) {
        setSent(true)
      } else {
        const body = await res.json()
        setError(body.message ?? t('error'))
      }
    } catch {
      setError(t('error'))
    } finally {
      setIsLoading(false)
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

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl shadow-black/10">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold">{t('sentTitle')}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t('sentDesc', { email: getValues('email') })}
              </p>
              <Link
                href={`/${locale}/login`}
                className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline mt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backToLogin')}
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-1">{t('title')}</h1>
                <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">{t('email')}</label>
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={cn(
                      'w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none transition-colors',
                      'placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary',
                      errors.email ? 'border-destructive' : 'border-border'
                    )}
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('submit')}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href={`/${locale}/login`}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('backToLogin')}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
