'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Navbar } from '@/components/layout/Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Terminal, Download, Settings, Play, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tool = 'vscode' | 'pycharm' | 'terminal'
type OS = 'mac' | 'windows' | 'linux'

interface Step {
  title: string
  description: string
  code?: string
  image?: string
  tip?: string
}

const VSCODE_STEPS: Record<OS, Step[]> = {
  mac: [
    {
      title: 'Download VS Code',
      description: 'Go to the official VS Code website and download the macOS version.',
      tip: 'Choose the "Apple Silicon" version if you have an M1/M2/M3 Mac.',
    },
    {
      title: 'Install VS Code',
      description: 'Open the downloaded .zip file. Drag "Visual Studio Code.app" to your Applications folder.',
    },
    {
      title: 'Install Python extension',
      description: 'Open VS Code → Press Cmd+Shift+X → Search "Python" → Install the Microsoft extension.',
    },
    {
      title: 'Install Python',
      description: 'Open Terminal and run:',
      code: 'brew install python3',
      tip: 'If you don\'t have Homebrew: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
    },
    {
      title: 'Verify installation',
      description: 'In Terminal, check that Python is installed:',
      code: 'python3 --version\n# Should show: Python 3.12.x',
    },
    {
      title: 'Create your first file',
      description: 'In VS Code: File → New File → Save as hello.py → Type and run:',
      code: 'print("Hello from VS Code!")',
      tip: 'Press the ▶ Run button in the top-right corner to run the file!',
    },
  ],
  windows: [
    {
      title: 'Download VS Code',
      description: 'Visit code.visualstudio.com and download "Windows x64" installer.',
    },
    {
      title: 'Run the installer',
      description: 'Run the downloaded VSCodeSetup.exe. Check "Add to PATH" during installation — this is important!',
    },
    {
      title: 'Install Python extension',
      description: 'Open VS Code → Press Ctrl+Shift+X → Search "Python" → Install the Microsoft extension.',
    },
    {
      title: 'Download Python',
      description: 'Go to python.org/downloads and download Python 3.12+. Run the installer and check "Add Python to PATH".',
    },
    {
      title: 'Verify in PowerShell',
      description: 'Open PowerShell (Win+X → Windows PowerShell) and run:',
      code: 'python --version\n# Should show: Python 3.12.x',
    },
    {
      title: 'Create your first file',
      description: 'In VS Code: File → New File → Save as hello.py → Write:',
      code: 'print("Hello from VS Code!")',
      tip: 'Press Ctrl+F5 to run without debugging.',
    },
  ],
  linux: [
    {
      title: 'Install VS Code',
      description: 'Run in terminal (Ubuntu/Debian):',
      code: 'sudo apt update\nsudo apt install code',
    },
    {
      title: 'Install Python extension',
      description: 'Open VS Code → Press Ctrl+Shift+X → Search "Python" → Install.',
    },
    {
      title: 'Install Python',
      description: 'Python is usually pre-installed. Verify:',
      code: 'python3 --version\n# Or install: sudo apt install python3',
    },
    {
      title: 'Create your first file',
      description: 'In VS Code: File → New File → Save as hello.py → Write:',
      code: 'print("Hello from VS Code!")',
    },
  ],
}

const TERMINAL_STEPS: Record<OS, Step[]> = {
  mac: [
    {
      title: 'Open Terminal',
      description: 'Press Cmd+Space → type "Terminal" → press Enter. Or find it in Applications → Utilities.',
    },
    {
      title: 'Basic navigation',
      description: 'Learn these essential commands:',
      code: 'ls          # list files\npwd         # show current directory\ncd Desktop  # go to Desktop\ncd ..       # go up one level\nmkdir code  # create folder "code"\ncd code     # enter it',
    },
    {
      title: 'Run Python',
      description: 'Navigate to your file and run it:',
      code: 'cd ~/Desktop\npython3 hello.py',
    },
    {
      title: 'Interactive Python shell',
      description: 'Type python3 to enter interactive mode — great for quick experiments:',
      code: 'python3\n>>> 2 + 2\n4\n>>> print("Hello!")\nHello!\n>>> exit()',
    },
  ],
  windows: [
    {
      title: 'Open PowerShell',
      description: 'Press Win+X → Windows PowerShell, or search "PowerShell" in Start Menu.',
    },
    {
      title: 'Basic navigation',
      description: 'Essential PowerShell commands:',
      code: 'dir          # list files\npwd          # show current path\ncd Desktop   # go to Desktop\ncd ..        # go up\nmkdir code   # create folder\ncd code      # enter it',
    },
    {
      title: 'Run Python',
      description: 'Navigate to your script and run it:',
      code: 'cd $env:USERPROFILE\\Desktop\npython hello.py',
    },
  ],
  linux: [
    {
      title: 'Open Terminal',
      description: 'Press Ctrl+Alt+T, or find it in your applications menu.',
    },
    {
      title: 'Basic navigation',
      description: 'Essential commands:',
      code: 'ls          # list files\npwd         # show current path\ncd Desktop  # go to Desktop\ncd ..       # go up\nmkdir code  # create folder\ncd code     # enter it',
    },
    {
      title: 'Run Python',
      description: 'Navigate to your file and run it:',
      code: 'cd ~/Desktop\npython3 hello.py',
    },
  ],
}

export default function SetupPage() {
  const locale = useLocale()
  const [tool, setTool] = useState<Tool>('vscode')
  const [os, setOS] = useState<OS>('mac')
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const steps = tool === 'terminal' ? TERMINAL_STEPS[os] : VSCODE_STEPS[os]

  const toggleStep = (i: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const TOOLS = [
    { value: 'vscode' as Tool, label: 'VS Code', icon: '⚡', desc: 'Recommended for beginners' },
    { value: 'pycharm' as Tool, label: 'PyCharm', icon: '🐍', desc: 'Best for Python' },
    { value: 'terminal' as Tool, label: 'Terminal', icon: '💻', desc: 'Command line basics' },
  ]

  const OS_OPTIONS = [
    { value: 'mac' as OS, label: 'macOS', icon: '🍎' },
    { value: 'windows' as OS, label: 'Windows', icon: '🪟' },
    { value: 'linux' as OS, label: 'Linux', icon: '🐧' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Set Up Your Dev Environment</h1>
          <p className="text-muted-foreground">Step-by-step guide to get your coding tools ready.</p>
        </div>

        {/* Tool selector */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {TOOLS.map(({ value, label, icon, desc }) => (
            <button
              key={value}
              onClick={() => { setTool(value); setCompletedSteps(new Set()) }}
              className={cn(
                'p-4 rounded-2xl border text-left transition-all',
                tool === value
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/40 hover:bg-accent/30'
              )}
            >
              <span className="text-2xl block mb-2">{icon}</span>
              <div className="font-semibold text-sm">{label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
            </button>
          ))}
        </div>

        {/* OS selector */}
        <div className="flex gap-2 mb-8">
          {OS_OPTIONS.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => { setOS(value); setCompletedSteps(new Set()) }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                os === value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/30'
              )}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{completedSteps.size}/{steps.length} steps</span>
        </div>
        <div className="progress-bar mb-8">
          <div
            className="progress-bar-fill"
            style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, i) => {
            const done = completedSteps.has(i)
            return (
              <motion.div
                key={`${tool}-${os}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'rounded-2xl border p-5 transition-all duration-300',
                  done ? 'border-green-500/30 bg-green-500/5' : 'border-border bg-card'
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Step number / check */}
                  <button
                    onClick={() => toggleStep(i)}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all',
                      done
                        ? 'bg-green-500 text-white'
                        : 'border-2 border-border text-muted-foreground hover:border-primary hover:text-primary'
                    )}
                  >
                    {done ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{step.description}</p>

                    {step.code && (
                      <div className="code-block text-sm mb-3 relative group">
                        <pre className="text-code-text whitespace-pre-wrap">{step.code}</pre>
                        <button
                          onClick={() => navigator.clipboard.writeText(step.code!)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 px-2 py-1 rounded text-xs bg-muted text-muted-foreground hover:text-foreground transition-all"
                        >
                          Copy
                        </button>
                      </div>
                    )}

                    {step.tip && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-sm text-amber-300">
                        <span className="shrink-0">💡</span>
                        <span>{step.tip}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Completion */}
        <AnimatePresence>
          {completedSteps.size === steps.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-6 rounded-2xl bg-green-500/10 border border-green-500/30 text-center"
            >
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-bold text-xl mb-2">Setup Complete!</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Your development environment is ready. Time to write some real code!
              </p>
              <a
                href={`/${locale}/learn/python-basics`}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                <Play className="w-4 h-4" />
                Start Learning Python
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
