'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Moon, Sun, Globe, Code2, Menu, X, Zap, User, LogOut, LayoutDashboard, Settings } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ru' : 'en'
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  const navLinks = [
    { href: `/${locale}/courses`, label: t('courses') },
    { href: `/${locale}/leaderboard`, label: t('leaderboard') },
    { href: `/${locale}/playground`, label: t('playground') },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="gradient-text">CodeNexus</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                isActive(link.href)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Locale toggle */}
          <button
            onClick={switchLocale}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            aria-label="Switch language"
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase">{locale}</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="w-4 h-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-2 left-2 w-4 h-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </button>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            {session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-xs font-bold">
                    {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate">{session.user?.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="text-sm font-semibold truncate">{session.user?.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{session.user?.email}</div>
                    </div>
                    <Link
                      href={`/${locale}/dashboard`}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent/50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                      Dashboard
                    </Link>
                    <Link
                      href={`/${locale}/profile`}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent/50 transition-colors"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      {t('profile')}
                    </Link>
                    <Link
                      href={`/${locale}/settings`}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent/50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      {t('settings')}
                    </Link>
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: `/${locale}` }) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="px-4 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                  {t('signIn')}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  {t('signUp')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'block px-4 py-2 rounded-md text-sm font-medium transition-colors',
                isActive(link.href)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border">
            {session ? (
              <div className="space-y-1">
                <Link
                  href={`/${locale}/dashboard`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-md text-sm hover:bg-accent/50 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                  Dashboard
                </Link>
                <Link
                  href={`/${locale}/profile`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-md text-sm hover:bg-accent/50 transition-colors"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  Profile
                </Link>
                <Link
                  href={`/${locale}/settings`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-md text-sm hover:bg-accent/50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Settings
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: `/${locale}` }) }}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href={`/${locale}/login`}
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 rounded-md text-sm font-medium border border-border hover:bg-accent/50 transition-colors"
                >
                  {t('signIn')}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {t('signUp')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
