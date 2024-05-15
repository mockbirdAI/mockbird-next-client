import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function POST(request: any) {
  const res = await request.json()
  const {userId, linkedinUrl, resumeUrl, bio, profilePicture, schools, companyId, experiences, currentLocation } = res;

  function sortExperiences(a: any, b: any) {
    const dateA = a.endDate ? new Date(a.endDate).getTime() : null;
    const dateB = b.endDate ? new Date(b.endDate).getTime() : null;

    if (dateA && dateB) {
      return dateB - dateA; 
    }

    if (!dateA && !dateB) {
      const startA = new Date(a.startDate).getTime();
      const startB = new Date(b.startDate).getTime();
      return startB - startA; 
    }

    if (!dateA) {
      return -1;
    }
    if (!dateB) {
      return 1;
    }
  }

  experiences.sort(sortExperiences);


  const result = await prisma.profile.upsert({
    where: {
      userId: userId,
    },
    update: {
      linkedinUrl,
      resumeUrl,
      bio,
      profilePicture,
      UserSchool: {
        deleteMany: {
          userId: userId
        },
        createMany: {
          data: schools.map((school: any) => {
            return {
              schoolId: Number(school.schoolId),
              degree: school.degree,
              major: school.major,
              startDate: new Date(school.startDate),
              endDate: school.endDate ? new Date(school.endDate) : null,
            }
          })
        }
      },
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
              endDate: experience.endDate ? new Date(experience.endDate) : null,
            }
          })
        }
      },
      currentLocation,
      slug: userId
    },
    create: {
      userId: userId,
      linkedinUrl,
      resumeUrl,
      bio,
      profilePicture,
      UserSchool: {
        createMany: {
          data: schools.map((school: any) => {
            return {
              schoolId: Number(school.schoolId),
              degree: school.degree,
              major: school.major,
              startDate: new Date(school.startDate),
              endDate: school.endDate ? new Date(school.endDate) : null,
            }
          })
        }
      },
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
      currentLocation,
      slug: userId
    }
  })

  return NextResponse.json({result})
}