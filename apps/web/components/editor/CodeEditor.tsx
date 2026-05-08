'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Editor, { type Monaco } from '@monaco-editor/react'
import { useTranslations, useLocale } from 'next-intl'
import { Play, RotateCcw, Copy, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

export type SupportedLanguage = 'python' | 'javascript' | 'typescript' | 'go' | 'java' | 'cpp' | 'sql'

interface CodeEditorProps {
  language: SupportedLanguage
  initialCode?: string
  readOnly?: boolean
  onCodeChange?: (code: string) => void
  onRunResult?: (result: RunResult) => void
  height?: string
  showOutput?: boolean
  lessonId?: string
}

interface RunResult {
  status: 'success' | 'error' | 'timeout'
  output: string
  executedMs?: number
}

const LANGUAGE_MAP: Record<SupportedLanguage, string> = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  go: 'go',
  java: 'java',
  cpp: 'cpp',
  sql: 'sql',
}

const DEFAULT_CODE: Record<SupportedLanguage, string> = {
  python: '# Python — пиши код здесь\nname = "CodeNexus"\nprint("Привет от", name)\n',
  javascript: '// JavaScript — пиши код здесь\nconst name = "CodeNexus";\nconsole.log("Привет от", name);\n',
  typescript: '// TypeScript — пиши код здесь\nconst name: string = "CodeNexus";\nconsole.log("Привет от", name);\n',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tname := "CodeNexus"\n\tfmt.Println("Привет от", name)\n}\n',
  java: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tString name = "CodeNexus";\n\t\tSystem.out.println("Привет от " + name);\n\t}\n}\n',
  cpp: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n\tstring name = "CodeNexus";\n\tcout << "Привет от " << name << endl;\n\treturn 0;\n}\n',
  sql: '-- SQL — пиши запрос здесь\nSELECT \'Привет от CodeNexus\' AS greeting;\n',
}

export function CodeEditor({
  language,
  initialCode,
  readOnly = false,
  onCodeChange,
  onRunResult,
  height = '300px',
  showOutput = true,
  lessonId,
}: CodeEditorProps) {
  const t = useTranslations('editor')
  const { resolvedTheme } = useTheme()
  const [code, setCode] = useState(initialCode ?? DEFAULT_CODE[language])
  const [output, setOutput] = useState<string | null>(null)
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [executedMs, setExecutedMs] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const editorRef = useRef<Parameters<NonNullable<Parameters<typeof Editor>[0]['onMount']>>[0] | null>(null)

  // Reset code and output when language changes (only if using default code, not fixed initialCode)
  useEffect(() => {
    if (!initialCode) {
      const newCode = DEFAULT_CODE[language]
      setCode(newCode)
      editorRef.current?.setValue(newCode)
      setOutput(null)
      setRunStatus('idle')
    }
  }, [language]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditorMount = useCallback((editor: typeof editorRef.current, monaco: Monaco) => {
    editorRef.current = editor

    // Custom theme — Dracula-inspired for maximum readability
    monaco.editor.defineTheme('nexus-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        // Base
        { token: '', foreground: 'f8f8f2' },
        // Comments
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'comment.go', foreground: '6272a4', fontStyle: 'italic' },
        // Keywords — bright pink
        { token: 'keyword', foreground: 'ff79c6', fontStyle: 'bold' },
        { token: 'keyword.go', foreground: 'ff79c6', fontStyle: 'bold' },
        { token: 'keyword.python', foreground: 'ff79c6', fontStyle: 'bold' },
        { token: 'keyword.java', foreground: 'ff79c6', fontStyle: 'bold' },
        { token: 'keyword.cpp', foreground: 'ff79c6', fontStyle: 'bold' },
        { token: 'keyword.js', foreground: 'ff79c6', fontStyle: 'bold' },
        { token: 'keyword.ts', foreground: 'ff79c6', fontStyle: 'bold' },
        // Strings — bright green
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'string.go', foreground: 'f1fa8c' },
        { token: 'string.python', foreground: 'f1fa8c' },
        { token: 'string.java', foreground: 'f1fa8c' },
        { token: 'string.cpp', foreground: 'f1fa8c' },
        { token: 'string.js', foreground: 'f1fa8c' },
        { token: 'string.ts', foreground: 'f1fa8c' },
        { token: 'string.escape', foreground: 'ff79c6' },
        // Numbers — orange
        { token: 'number', foreground: 'bd93f9' },
        { token: 'number.go', foreground: 'bd93f9' },
        { token: 'number.python', foreground: 'bd93f9' },
        // Types — cyan
        { token: 'type', foreground: '8be9fd' },
        { token: 'type.go', foreground: '8be9fd' },
        { token: 'type.identifier', foreground: '8be9fd' },
        { token: 'entity.name.type', foreground: '8be9fd' },
        // Functions — green
        { token: 'function', foreground: '50fa7b' },
        { token: 'entity.name.function', foreground: '50fa7b' },
        // Identifiers / variables
        { token: 'identifier', foreground: 'f8f8f2' },
        { token: 'variable', foreground: 'f8f8f2' },
        // Delimiters
        { token: 'delimiter', foreground: 'f8f8f2' },
        { token: 'delimiter.go', foreground: 'f8f8f2' },
        { token: 'delimiter.bracket', foreground: 'ffb86c' },
        // Operators
        { token: 'operator', foreground: 'ff79c6' },
        { token: 'operator.go', foreground: 'ff79c6' },
        // SQL
        { token: 'keyword.sql', foreground: 'ff79c6', fontStyle: 'bold' },
        { token: 'string.sql', foreground: 'f1fa8c' },
        { token: 'number.sql', foreground: 'bd93f9' },
        { token: 'operator.sql', foreground: 'ff79c6' },
      ],
      colors: {
        'editor.background': '#282a36',
        'editor.foreground': '#f8f8f2',
        'editorLineNumber.foreground': '#6272a4',
        'editorLineNumber.activeForeground': '#f8f8f2',
        'editor.lineHighlightBackground': '#44475a50',
        'editorCursor.foreground': '#f8f8f2',
        'editor.selectionBackground': '#44475a',
        'editor.wordHighlightBackground': '#44475a80',
        'editorGutter.background': '#282a36',
        'scrollbar.shadow': '#282a36',
        'scrollbarSlider.background': '#44475a60',
        'scrollbarSlider.hoverBackground': '#6272a460',
        'scrollbarSlider.activeBackground': '#6272a480',
        'minimap.background': '#282a36',
        'editorBracketMatch.background': '#44475a',
        'editorBracketMatch.border': '#ff79c6',
      },
    })

    monaco.editor.defineTheme('nexus-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#f8fafc',
        'editorGutter.background': '#f8fafc',
      },
    })

    monaco.editor.setTheme(resolvedTheme === 'dark' ? 'nexus-dark' : 'nexus-light')
  }, [resolvedTheme])

  const handleRun = async () => {
    if (runStatus === 'running') return
    setRunStatus('running')
    setOutput(null)

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, lessonId }),
      })

      const data: RunResult = await res.json()
      setOutput(data.output)
      setExecutedMs(data.executedMs ?? null)
      setRunStatus(data.status === 'success' ? 'success' : 'error')
      onRunResult?.(data)
    } catch {
      setOutput('Failed to connect to execution service.')
      setRunStatus('error')
    }
  }

  const handleReset = () => {
    const defaultCode = initialCode ?? DEFAULT_CODE[language]
    setCode(defaultCode)
    editorRef.current?.setValue(defaultCode)
    setOutput(null)
    setRunStatus('idle')
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleChange = (value: string | undefined) => {
    const newCode = value ?? ''
    setCode(newCode)
    onCodeChange?.(newCode)
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-[#282a36] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-2 capitalize">{language}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : t('copy')}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t('clear')}
          </button>
          {!readOnly && (
            <button
              onClick={handleRun}
              disabled={runStatus === 'running'}
              className={cn(
                'flex items-center gap-1.5 px-4 py-1 rounded-md text-xs font-semibold transition-all',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                runStatus === 'running' && 'opacity-70 cursor-not-allowed'
              )}
            >
              {runStatus === 'running' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              {runStatus === 'running' ? t('running') : t('run')}
            </button>
          )}
        </div>
      </div>

      {/* Monaco Editor */}
      <Editor
        height={height}
        language={LANGUAGE_MAP[language]}
        value={code}
        onChange={handleChange}
        onMount={handleEditorMount}
        options={{
          readOnly: readOnly || runStatus === 'running',
          fontSize: 14,
          fontFamily: 'var(--font-jetbrains-mono), "Fira Code", monospace',
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          renderLineHighlight: 'line',
          bracketPairColorization: { enabled: true },
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          formatOnPaste: true,
          tabSize: 4,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
        }}
        loading={
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Loading editor...
          </div>
        }
      />

      {/* Output Panel */}
      {showOutput && output !== null && (
        <div className="border-t border-border">
          <div className="flex items-center gap-2 px-4 py-2 bg-card">
            {runStatus === 'success' ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-xs font-medium">
              {runStatus === 'success' ? t('success') : t('error')}
            </span>
            {executedMs !== null && (
              <span className="text-xs text-muted-foreground ml-auto">
                {executedMs}ms
              </span>
            )}
          </div>
          <div className="px-4 py-3 font-mono text-sm max-h-48 overflow-y-auto bg-[#21222c]">
            <pre
              className={cn(
                'whitespace-pre-wrap break-words',
                runStatus === 'success' ? 'text-green-400' : 'text-red-400'
              )}
            >
              {output}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
