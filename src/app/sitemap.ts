import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'
import { UserRole } from '@prisma/client';
 
type changeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  let recruiters = await prisma.user.findMany({
    where: {
      role: UserRole.RECRUITER
    }
  })

  const recruiterRoutes = recruiters.map((recruiter) => ({
    url: `https://mockbird.ai/recruiter/${recruiter.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as changeFrequency,
  }))

  const routes = ['', '/dashboard'].map((route) => ({
    url: `https://mockbird.ai${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as changeFrequency,
  }))
  
  return [...routes, ...recruiterRoutes]
}