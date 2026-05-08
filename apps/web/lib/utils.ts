import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`
  return xp.toString()
}

export function getLevelFromXP(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100))
}

export function getXPForNextLevel(level: number): number {
  return (level + 1) * (level + 1) * 100
}

export function getProgressToNextLevel(xp: number): number {
  const level = getLevelFromXP(xp)
  const currentLevelXP = level * level * 100
  const nextLevelXP = getXPForNextLevel(level)
  return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
}

export const LANGUAGE_COLORS: Record<string, string> = {
  python: '#3776AB',
  javascript: '#F7DF1E',
  typescript: '#3178C6',
  go: '#00ADD8',
  java: '#ED8B00',
  cpp: '#00599C',
  sql: '#336791',
  html: '#E34F26',
  css: '#1572B6',
}

export const LANGUAGE_ICONS: Record<string, string> = {
  python: '🐍',
  javascript: '⚡',
  typescript: '🔷',
  go: '🐹',
  java: '☕',
  cpp: '⚙️',
  sql: '🗄️',
  html: '🌐',
  css: '🎨',
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
