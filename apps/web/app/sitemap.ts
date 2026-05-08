import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://codenexus.app'
const locales = ['en', 'ru']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await db.course.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  })

  const staticRoutes = ['', '/courses', '/leaderboard']

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
    }))
  )

  const courseEntries: MetadataRoute.Sitemap = courses.flatMap((course) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/learn/${course.slug}`,
      lastModified: course.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  return [...staticEntries, ...courseEntries]
}
