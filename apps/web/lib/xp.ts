import { db } from './db'

interface AwardResult {
  newXP: number
  achievements: string[]
}

// XP multipliers per streak length
const STREAK_BONUS: Record<number, number> = {
  3: 1.1,
  7: 1.25,
  14: 1.5,
  30: 2.0,
}

function getStreakMultiplier(streak: number): number {
  const thresholds = Object.keys(STREAK_BONUS)
    .map(Number)
    .sort((a, b) => b - a)
  for (const t of thresholds) {
    if (streak >= t) return STREAK_BONUS[t]
  }
  return 1.0
}

export async function awardXP(userId: string, baseXP: number): Promise<AwardResult> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { xp: true, streak: true, lastSeen: true },
  })
  if (!user) return { newXP: 0, achievements: [] }

  // Update streak based on calendar days (not hours)
  const now = new Date()
  const lastSeen = user.lastSeen
  const todayStr = now.toDateString()
  const lastStr = lastSeen.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()

  let newStreak: number
  if (lastStr === todayStr) {
    newStreak = user.streak // same day — no change
  } else if (lastStr === yesterdayStr) {
    newStreak = user.streak + 1 // consecutive day
  } else {
    newStreak = 1 // streak broken, start fresh
  }

  // Apply multiplier
  const multiplier = getStreakMultiplier(newStreak)
  const xpToAdd = Math.round(baseXP * multiplier)
  const newXP = user.xp + xpToAdd

  await db.user.update({
    where: { id: userId },
    data: { xp: newXP, streak: newStreak, lastSeen: now },
  })

  // Check for newly earned achievements
  const achievements = await checkAchievements(userId, newXP, newStreak)
  return { newXP, achievements }
}

export async function checkAchievements(
  userId: string,
  xp: number,
  streak: number
): Promise<string[]> {
  const allAchievements = await db.achievement.findMany()
  const earned = await db.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  })
  const earnedIds = new Set(earned.map((e) => e.achievementId))

  const toAward: string[] = []

  for (const ach of allAchievements) {
    if (earnedIds.has(ach.id)) continue
    const cond = ach.condition as { type: string; value: number }

    const qualifies =
      (cond.type === 'xp' && xp >= cond.value) ||
      (cond.type === 'streak' && streak >= cond.value)

    if (qualifies) {
      await db.userAchievement.create({
        data: { userId, achievementId: ach.id },
      })
      // Bonus XP for achievement
      await db.user.update({
        where: { id: userId },
        data: { xp: { increment: ach.xpReward } },
      })
      toAward.push(ach.slug)
    }
  }

  return toAward
}
