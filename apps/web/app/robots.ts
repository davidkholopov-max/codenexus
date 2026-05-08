import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://codenexus.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/en/', '/ru/'],
        disallow: ['/api/', '/en/dashboard', '/ru/dashboard', '/en/settings', '/ru/settings', '/en/profile', '/ru/profile'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
