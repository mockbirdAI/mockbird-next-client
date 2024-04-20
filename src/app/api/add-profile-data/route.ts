import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function POST(request: any) {
  const res = await request.json()
  console.log(res)
  const {userId, linkedinUrl, resumeUrl, bio, profilePicture, schoolId, companyId, experiences } = res;
  const result = await prisma.profile.upsert({
    where: {
      userId: userId,
    },
    update: {
      linkedinUrl,
      resumeUrl,
      bio,
      profilePicture,
      schoolId,
      UserCompany: {
        deleteMany: {
          userId: userId
        },
        createMany: {
          data: experiences.map((experience: any) => {
            return {
              companyId: Number(experience.companyId),
              role: experience.roleTitle,
              startDate: new Date(experience.startDate),
              endDate: new Date(experience.endDate),
            }
          })
        }
      }
    },
    create: {
      userId: userId,
      linkedinUrl,
      resumeUrl,
      bio,
      profilePicture,
      schoolId,
      UserCompany: {
        createMany: {
          data: experiences.map((experience: any) => {
            return {
              companyId: Number(experience.companyId),
              role: experience.roleTitle,
              startDate: new Date(experience.startDate),
              endDate: new Date(experience.endDate),
            }
          })
        }
      },
    }
  })

  return NextResponse.json({result})
}