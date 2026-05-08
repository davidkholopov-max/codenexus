'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Code2, Loader2, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'

const schema = z.object({
  password: z.string().min(8, 'Минимум 8 символов'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

type Form = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const t = useTranslations('auth.resetPassword')
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [showPassword, setShowPassword] = useState(false)
  const [done, setDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 text-center space-y-4">
          <XCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold">{t('invalidTitle')}</h2>
          <p className="text-muted-foreground text-sm">{t('invalidDesc')}</p>
          <Link href={`/${locale}/forgot-password`} className="text-primary text-sm hover:underline">
            {t('requestNew')}
          </Link>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: Form) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      })
      if (res.ok) {
        setDone(true)
        setTimeout(() => router.push(`/${locale}/login`), 3000)
      } else {
        const body = await res.json()
        setError(body.code === 'invalid_token' ? t('invalidToken') : t('error'))
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
          {done ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold">{t('successTitle')}</h2>
              <p className="text-muted-foreground text-sm">{t('successDesc')}</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
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
                  <label className="text-sm font-medium">{t('newPassword')}</label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={cn(
                        'w-full px-3 py-2.5 pr-10 rounded-xl border bg-background text-sm outline-none transition-colors',
                        'placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary',
                        errors.password ? 'border-destructive' : 'border-border'
                      )}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">{t('confirmPassword')}</label>
                  <input
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={cn(
                      'w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none transition-colors',
                      'placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary',
                      errors.confirmPassword ? 'border-destructive' : 'border-border'
                    )}
                  />
                  {errors.confirmPassword && <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>}
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
