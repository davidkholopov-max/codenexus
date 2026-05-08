'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Navbar } from '@/components/layout/Navbar'
import { CodeEditor, type SupportedLanguage } from '@/components/editor/CodeEditor'

const LANGUAGES: { value: SupportedLanguage; label: string; icon: string }[] = [
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'javascript', label: 'JavaScript', icon: '⚡' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'go', label: 'Go', icon: '🐹' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'cpp', label: 'C++', icon: '⚙️' },
  { value: 'sql', label: 'SQL', icon: '🗄️' },
]

export default function PlaygroundPage() {
  const t = useTranslations('editor')
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('python')

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">Write, run, and experiment with code in your browser.</p>
        </div>

        {/* Language selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {LANGUAGES.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setSelectedLanguage(value)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                selectedLanguage === value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-accent/30'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Editor */}
        <CodeEditor
          language={selectedLanguage}
          height="500px"
          showOutput={true}
        />

        {/* Tips */}
        <div className="mt-8 p-4 rounded-xl border border-border bg-card/50">
          <h3 className="font-semibold text-sm mb-2">💡 Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Ctrl+Enter</kbd> to run your code</li>
            <li>• Code runs in an isolated Docker container — safe and sandboxed</li>
            <li>• Execution is limited to 10 seconds</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
