'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Navbar } from '@/components/layout/Navbar'
import { Sun, Moon, Monitor, Globe, Lock, Trash2, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import axios from 'axios'

export default function SettingsPage() {
  const t = useTranslations('settings')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push(`/${locale}/login`)
  }, [status])

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setPwError('Password must be at least 8 characters')
      return
    }
    setPwSaving(true)
    setPwError('')
    try {
      await axios.patch('/api/auth/password', { currentPassword, newPassword })
      setPwSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPwSuccess(false), 3000)
    } catch (err: any) {
      setPwError(err.response?.data?.message ?? 'Failed to update password')
    } finally {
      setPwSaving(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">{t('title')}</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-1">{t('appearance')}</h2>
            <p className="text-sm text-muted-foreground mb-5">Choose how CodeNexus looks for you</p>

            <div className="mb-6">
              <p className="text-sm font-medium mb-3">{t('theme')}</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: t('themeLight'), icon: Sun },
                  { value: 'dark', label: t('themeDark'), icon: Moon },
                  { value: 'system', label: t('themeSystem'), icon: Monitor },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                      theme === value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/30'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{label}</span>
                    {theme === value && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">{t('language')}</p>
              <div className="flex gap-3">
                {[
                  { value: 'en', label: 'English', flag: '🇺🇸' },
                  { value: 'ru', label: 'Русский', flag: '🇷🇺' },
                ].map(({ value, label, flag }) => (
                  <button
                    key={value}
                    onClick={() => switchLocale(value)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                      locale === value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/30'
                    )}
                  >
                    <span>{flag}</span>
                    {label}
                    {locale === value && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Password */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-1">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <h2 className="font-semibold text-lg">{t('account')}</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">Update your password</p>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors"
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {pwError && (
                <p className="text-sm text-destructive">{pwError}</p>
              )}
              {pwSuccess && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Password updated successfully
                </p>
              )}

              <button
                type="submit"
                disabled={pwSaving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
              >
                {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Update Password
              </button>
            </form>
          </section>

          {/* Danger zone */}
          <section className="bg-card border border-destructive/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-1">
              <Trash2 className="w-5 h-5 text-destructive" />
              <h2 className="font-semibold text-lg text-destructive">{t('dangerZone')}</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Once you delete your account, all your data will be permanently removed.
            </p>
            <button
              onClick={() => window.confirm('Are you sure? This cannot be undone.') && alert('Contact support to delete your account.')}
              className="flex items-center gap-2 px-5 py-2 rounded-xl border border-destructive text-destructive text-sm font-semibold hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {t('deleteAccount')}
            </button>
          </section>
        </div>
      </main>
    </div>
  )
}
