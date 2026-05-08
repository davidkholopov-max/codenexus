import type { PrismaClient } from '@prisma/client'

export async function seedAchievements(db: PrismaClient) {
  const achievements = [
    {
      slug: 'first-lesson',
      titleEn: 'First Step',
      titleRu: 'Первый шаг',
      descEn: 'Complete your first lesson',
      descRu: 'Пройди первый урок',
      icon: '🎯',
      xpReward: 50,
      rarity: 'common',
      condition: { type: 'xp', value: 10 },
    },
    {
      slug: 'streak-3',
      titleEn: '3-Day Streak',
      titleRu: '3 дня подряд',
      descEn: 'Learn 3 days in a row',
      descRu: 'Учись 3 дня подряд',
      icon: '🔥',
      xpReward: 100,
      rarity: 'common',
      condition: { type: 'streak', value: 3 },
    },
    {
      slug: 'streak-7',
      titleEn: 'Week Warrior',
      titleRu: 'Неделя побед',
      descEn: 'Learn 7 days in a row',
      descRu: 'Учись 7 дней подряд',
      icon: '⚡',
      xpReward: 250,
      rarity: 'rare',
      condition: { type: 'streak', value: 7 },
    },
    {
      slug: 'streak-30',
      titleEn: 'Month Master',
      titleRu: 'Месяц обучения',
      descEn: 'Learn 30 days in a row',
      descRu: 'Учись 30 дней подряд',
      icon: '🏆',
      xpReward: 1000,
      rarity: 'epic',
      condition: { type: 'streak', value: 30 },
    },
    {
      slug: 'xp-500',
      titleEn: 'Rising Star',
      titleRu: 'Восходящая звезда',
      descEn: 'Earn 500 XP',
      descRu: 'Заработай 500 XP',
      icon: '⭐',
      xpReward: 50,
      rarity: 'common',
      condition: { type: 'xp', value: 500 },
    },
    {
      slug: 'xp-2000',
      titleEn: 'XP Grinder',
      titleRu: 'Охотник за XP',
      descEn: 'Earn 2000 XP',
      descRu: 'Заработай 2000 XP',
      icon: '💎',
      xpReward: 200,
      rarity: 'rare',
      condition: { type: 'xp', value: 2000 },
    },
    {
      slug: 'xp-10000',
      titleEn: 'Code Legend',
      titleRu: 'Легенда кода',
      descEn: 'Earn 10,000 XP',
      descRu: 'Заработай 10 000 XP',
      icon: '👑',
      xpReward: 1000,
      rarity: 'legendary',
      condition: { type: 'xp', value: 10000 },
    },
  ]

  for (const ach of achievements) {
    await db.achievement.upsert({
      where: { slug: ach.slug },
      update: ach,
      create: ach,
    })
  }
  console.log(`  ✓ Seeded ${achievements.length} achievements`)
}
