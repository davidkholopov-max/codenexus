'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Code2, Github, Twitter } from 'lucide-react'

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations('nav')

  return (
    <footer className="border-t border-border bg-card/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="gradient-text">CodeNexus</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Interactive coding education platform. Learn programming from scratch to professional level.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Platform</h4>
            <div className="space-y-2">
              {[
                { href: `/${locale}/courses`, label: t('courses') },
                { href: `/${locale}/playground`, label: t('playground') },
                { href: `/${locale}/dashboard`, label: t('dashboard') },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Account</h4>
            <div className="space-y-2">
              {[
                { href: `/${locale}/login`, label: t('signIn') },
                { href: `/${locale}/register`, label: t('signUp') },
                { href: `/${locale}/profile`, label: t('profile') },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CodeNexus. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href={`/${locale}/privacy`} className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
