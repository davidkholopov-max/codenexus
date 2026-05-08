import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const LANG_ICONS: Record<string, string> = {
  python: '🐍',
  javascript: '⚡',
  go: '🐹',
  java: '☕',
  cpp: '⚙️',
  sql: '🗄️',
  html: '🌐',
  css: '🎨',
}

const LANG_COLORS: Record<string, string> = {
  python: '#3b82f6',
  javascript: '#eab308',
  go: '#06b6d4',
  java: '#f97316',
  cpp: '#8b5cf6',
  sql: '#10b981',
  html: '#ef4444',
  css: '#ec4899',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Learn to Code'
  const subtitle = searchParams.get('subtitle') ?? 'Interactive programming courses'
  const language = searchParams.get('lang') ?? ''
  const type = searchParams.get('type') ?? 'course'

  const icon = LANG_ICONS[language] ?? '📚'
  const accentColor = LANG_COLORS[language] ?? '#6366f1'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#09090b',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background gradient circle */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            right: '-200px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
          }}
        />

        {/* Top: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}
          >
            ⚡
          </div>
          <span style={{ color: '#e2e8f0', fontSize: '24px', fontWeight: 700 }}>
            CodeNexus
          </span>
        </div>

        {/* Center: Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {language && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '48px',
                marginBottom: '8px',
              }}
            >
              {icon}
              <span
                style={{
                  fontSize: '18px',
                  color: accentColor,
                  fontWeight: 600,
                  background: `${accentColor}18`,
                  padding: '4px 14px',
                  borderRadius: '999px',
                  border: `1px solid ${accentColor}30`,
                }}
              >
                {type === 'course' ? 'Course' : 'Lesson'}
              </span>
            </div>
          )}
          <div
            style={{
              fontSize: title.length > 40 ? '48px' : '56px',
              fontWeight: 800,
              color: '#f8fafc',
              lineHeight: 1.15,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#94a3b8',
              maxWidth: '800px',
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom: CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ color: '#64748b', fontSize: '18px' }}>
            codenexus.app — Free interactive coding courses
          </span>
          <div
            style={{
              background: accentColor,
              color: '#fff',
              fontSize: '18px',
              fontWeight: 600,
              padding: '12px 28px',
              borderRadius: '10px',
            }}
          >
            Start Learning →
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
