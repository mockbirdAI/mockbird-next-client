import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'
import { UserRole } from '@prisma/client';
 
type changeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recruiters = await prisma.user.findMany({
    where: {
      role: UserRole.RECRUITER
    },
    select: {
      id: true,
      profile: {
        select: {
          slug: true
        }
      }
    }
  })

  const recruiterRoutes = recruiters.map((recruiter) => ({
    url: recruiter.profile?.slug ? `https://mockbird.ai/recruiter/${recruiter.profile.slug}` : `https://mockbird.ai/recruiter/${recruiter.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as changeFrequency,
  }))

  const routes = ['', '/about', '/support-ticket'].map((route) => ({
    url: `https://mockbird.ai${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as changeFrequency,
  }))
  
  return [...routes, ...recruiterRoutes]
}