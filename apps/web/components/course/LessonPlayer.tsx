'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle, Lightbulb, Zap, Clock, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { cn } from '@/lib/utils'
import type { LessonFull } from '@/lib/hooks/useLesson'
import axios from 'axios'

interface LessonPlayerProps {
  lesson: LessonFull
  locale: string
  courseSlug: string
  onComplete?: (score?: number) => void
  nextLessonSlug?: string
}

export function LessonPlayer({ lesson, locale, courseSlug, onComplete, nextLessonSlug }: LessonPlayerProps) {
  const t = useTranslations('learn')
  const router = useRouter()
  const isRu = locale === 'ru'
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    score: number
    passed: boolean
    compilerUnavailable?: boolean
    results: { passed: boolean; actualOutput: string; expectedOutput?: string; isHidden: boolean }[]
  } | null>(null)
  const [currentCode, setCurrentCode] = useState(lesson.exercise?.starterCode ?? '')

  const title = isRu ? lesson.titleRu : lesson.titleEn
  const content = isRu ? lesson.contentRu : lesson.contentEn
  const isCompleted = lesson.userProgress?.completed ?? false

  const hints = lesson.exercise?.hints ?? []
  const currentHint = hints[hintIndex]

  const goToNextLesson = () => {
    if (nextLessonSlug) {
      router.push(`?lesson=${nextLessonSlug}`)
    }
  }

  const handleTheoryComplete = () => {
    if (isCompleted) {
      goToNextLesson()
    } else {
      triggerCompletion(100)
    }
  }

  const handleValidate = async () => {
    if (!lesson.exercise) return
    setIsValidating(true)
    setValidationResult(null)

    try {
      const res = await axios.post('/api/validate', {
        lessonId: lesson.id,
        code: currentCode,
        language: lesson.exercise.language,
      })
      const data = res.data
      setValidationResult(data)

      if (data.passed) {
        triggerCompletion(data.score)
      }
    } catch (err: any) {
      const isNetworkError = !err?.response || err?.response?.status >= 500
      setValidationResult({
        score: 0,
        passed: false,
        compilerUnavailable: isNetworkError,
        results: [],
      })
    } finally {
      setIsValidating(false)
    }
  }

  const triggerCompletion = (score: number) => {
    if (!isCompleted) {
      onComplete?.(score)
    }
    setShowCompleteModal(true)
    setTimeout(() => {
      setShowCompleteModal(false)
      goToNextLesson()
    }, 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <span className="capitalize px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
            {t(lesson.type as any)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {lesson.estimatedMin} min
          </span>
          <span className="xp-badge">
            <Zap className="w-3 h-3" />
            {lesson.xpReward} XP
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1 text-green-500 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              {t('lessonComplete')}
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      </div>

      {/* THEORY */}
      {lesson.type === 'theory' && (
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 prose-content">
            <MarkdownContent content={content} />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleTheoryComplete}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              {t('nextLesson')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* EXERCISE */}
      {lesson.type === 'exercise' && lesson.exercise && (
        <div className="space-y-5">
          {/* Instructions */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <MarkdownContent content={isRu ? lesson.exercise.instructionsRu : lesson.exercise.instructionsEn} />
          </div>

          {/* Hints */}
          {hints.length > 0 && (
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'Hide hint' : t('showHint')}
                {hints.length > 1 && showHint && (
                  <span className="text-xs text-muted-foreground">
                    ({hintIndex + 1}/{hints.length})
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showHint && currentHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-sm text-amber-200"
                  >
                    <strong>{t('hint')}:</strong>{' '}
                    {isRu ? currentHint.textRu : currentHint.textEn}
                    {hints.length > 1 && hintIndex < hints.length - 1 && (
                      <button
                        onClick={() => setHintIndex((i) => i + 1)}
                        className="ml-3 text-xs underline opacity-70 hover:opacity-100"
                      >
                        Next hint →
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Code Editor */}
          <CodeEditor
            language={lesson.exercise.language as any}
            initialCode={lesson.exercise.starterCode}
            height="320px"
            showOutput
            onCodeChange={setCurrentCode}
            lessonId={lesson.id}
          />

          {/* Validation results */}
          <AnimatePresence>
            {validationResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  'rounded-2xl border p-4',
                  validationResult.compilerUnavailable
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : validationResult.passed
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-red-500/30 bg-red-500/5'
                )}
              >
                {validationResult.compilerUnavailable ? (
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 text-lg">⚠️</span>
                    <div>
                      <div className="font-semibold text-sm text-amber-400 mb-1">
                        {isRu ? 'Компилятор недоступен' : 'Compiler unavailable'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isRu
                          ? `Для запуска кода на ${lesson.exercise?.language ?? 'этом языке'} нужен Docker. Запустите: docker compose up -d`
                          : `Running ${lesson.exercise?.language ?? 'this language'} requires Docker. Run: docker compose up -d`}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      {validationResult.passed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <span className="text-red-400 font-medium">✗</span>
                      )}
                      <span className="font-semibold text-sm">
                        {validationResult.passed ? t('correct') : t('incorrect')}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        Score: {validationResult.score}/100
                      </span>
                    </div>

                    {/* Console output block */}
                    {validationResult.results[0]?.actualOutput && (
                      <div className="mb-3">
                        <div className="text-xs text-muted-foreground mb-1 font-medium">
                          {isRu ? 'Вывод программы:' : 'Program output:'}
                        </div>
                        <pre className={cn(
                          'text-xs font-mono px-3 py-2 rounded-lg whitespace-pre-wrap break-words',
                          validationResult.passed
                            ? 'bg-green-500/10 text-green-200'
                            : 'bg-red-500/10 text-red-200'
                        )}>
                          {validationResult.results[0].actualOutput.trim() || '(empty)'}
                        </pre>
                      </div>
                    )}

                    {/* Test results */}
                    <div className="space-y-2">
                      {validationResult.results
                        .filter((r) => !r.isHidden)
                        .map((r, i) => (
                          <div
                            key={i}
                            className={cn(
                              'text-xs p-2 rounded-lg font-mono',
                              r.passed ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'
                            )}
                          >
                            <span className="mr-2">{r.passed ? '✓' : '✗'}</span>
                            {r.passed ? (
                              <span>Test {i + 1}: passed</span>
                            ) : (
                              <span>
                                {isRu ? 'Ожидалось' : 'Expected'}: <code>{r.expectedOutput}</code>
                                {' | '}
                                {isRu ? 'Получено' : 'Got'}: <code>{r.actualOutput?.trim() || '(empty)'}</code>
                              </span>
                            )}
                          </div>
                        ))}
                      {validationResult.results.filter((r) => r.isHidden).length > 0 && (
                        <div className="text-xs text-muted-foreground px-2">
                          + {validationResult.results.filter((r) => r.isHidden).length}{' '}
                          {isRu ? 'скрытых тестов' : 'hidden test(s)'}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Check answer button */}
          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {isValidating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</>
            ) : (
              <>{t('checkAnswer')}</>
            )}
          </button>
        </div>
      )}

      {/* QUIZ */}
      {lesson.type === 'quiz' && (
        <QuizPlayer
          items={lesson.quizItems}
          locale={locale}
          onComplete={(score) => triggerCompletion(score)}
        />
      )}

      {/* Completion toast */}
      <AnimatePresence>
        {showCompleteModal && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-card border border-green-500/30 rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-full bg-green-500/15 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="font-semibold">{t('lessonComplete')}</div>
              <div className="text-xs text-amber-500 mt-0.5">+{lesson.xpReward} {t('xpEarned')}</div>
            </div>
            {nextLessonSlug && (
              <button
                onClick={() => { setShowCompleteModal(false); goToNextLesson() }}
                className="ml-2 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                {isRu ? 'Далее' : 'Next'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Quiz sub-component ───────────────────────────────────────────────────────

interface QuizPlayerProps {
  items: LessonFull['quizItems']
  locale: string
  onComplete: (score: number) => void
}

function QuizPlayer({ items, locale, onComplete }: QuizPlayerProps) {
  const t = useTranslations('learn')
  const isRu = locale === 'ru'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const item = items[currentIndex]
  if (!item) {
    const score = Math.round((correctCount / items.length) * 100)
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold mb-2">{isRu ? 'Квиз завершён!' : 'Quiz Complete!'}</h3>
        <p className="text-muted-foreground mb-2">
          {correctCount}/{items.length} {isRu ? 'правильно' : 'correct'}
        </p>
        <p className="text-lg font-semibold text-primary mb-6">{score}%</p>
        <button
          onClick={() => onComplete(score)}
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold"
        >
          {t('nextLesson')} →
        </button>
      </div>
    )
  }

  const question = isRu ? item.questionRu : item.questionEn
  const options = (item.options as { textEn: string; textRu: string; isCorrect?: boolean; explanationEn?: string; explanationRu?: string }[])
  const correctIdx = options.findIndex((o) => o.isCorrect)
  const isCorrect = selected === correctIdx
  const explanation = checked
    ? (isRu ? options[correctIdx]?.explanationRu : options[correctIdx]?.explanationEn)
    : null

  const handleCheck = () => {
    if (selected === null) return
    setChecked(true)
    if (isCorrect) setCorrectCount((c) => c + 1)
  }

  const handleNext = () => {
    setSelected(null)
    setChecked(false)
    setCurrentIndex((i) => i + 1)
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{isRu ? `Вопрос ${currentIndex + 1} из ${items.length}` : `Question ${currentIndex + 1} of ${items.length}`}</span>
        <span>{correctCount} {isRu ? 'правильно' : 'correct'}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${(currentIndex / items.length) * 100}%` }} />
      </div>

      <h3 className="font-semibold text-lg">{question}</h3>

      <div className="space-y-2.5">
        {options.map((opt, i) => {
          const label = isRu ? opt.textRu : opt.textEn
          const isSelected = selected === i
          const isCorrectOpt = i === correctIdx
          return (
            <button
              key={i}
              disabled={checked}
              onClick={() => setSelected(i)}
              aria-label={label}
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                checked && isCorrectOpt && 'border-green-500 bg-green-500/10 text-green-400',
                checked && isSelected && !isCorrectOpt && 'border-red-500 bg-red-500/10 text-red-400',
                !checked && isSelected && 'border-primary bg-primary/10 text-primary',
                !checked && !isSelected && 'border-border hover:border-primary/40 hover:bg-accent/30'
              )}
            >
              <span className="mr-3 text-muted-foreground font-mono text-xs">
                {String.fromCharCode(65 + i)}.
              </span>
              {label}
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'p-3 rounded-xl text-sm',
              isCorrect
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            )}
          >
            <div className="font-medium mb-1">{isCorrect ? t('correct') : t('incorrect')}</div>
            {explanation && (
              <div className="text-xs opacity-80 mt-1">{explanation}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!checked ? (
        <button
          disabled={selected === null}
          onClick={handleCheck}
          aria-label={t('checkAnswer')}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50"
        >
          {t('checkAnswer')}
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
        >
          {currentIndex + 1 < items.length
            ? (isRu ? 'Следующий вопрос →' : 'Next Question →')
            : (isRu ? 'Завершить квиз →' : 'Finish Quiz →')}
        </button>
      )}
    </div>
  )
}

// ─── Markdown renderer ────────────────────────────────────────────────────────

function MarkdownContent({ content }: { content: string }) {
  const html = content
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-2 mb-4">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-6 mb-3">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-4 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/`([^`\n]+)`/g, '<code class="font-mono text-sm bg-muted px-1.5 py-0.5 rounded text-primary">$1</code>')
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="code-block my-4 text-sm leading-relaxed overflow-x-auto"><code class="text-code-text">$1</code></pre>')
    .replace(/^\| (.+) \|$/gm, (_, row) => {
      const cells = row.split(' | ')
      return '<tr>' + cells.map((c: string) => `<td class="px-3 py-1.5 border border-border text-sm">${c}</td>`).join('') + '</tr>'
    })
    .replace(/(<tr>[\s\S]+?<\/tr>)+/g, '<div class="overflow-x-auto my-4"><table class="border-collapse w-full">$&</table></div>')
    .replace(/^\| [-|: ]+\|$/gm, '')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc text-sm mt-1">$1</li>')
    .replace(/(<li[\s\S]+?<\/li>)+/g, '<ul class="my-3 space-y-1">$&</ul>')
    .replace(/\n\n(?!<)/g, '<br class="my-2"/>')

  return (
    <div
      className="text-foreground leading-relaxed space-y-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
