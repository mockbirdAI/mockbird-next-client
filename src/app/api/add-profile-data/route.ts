import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function POST(request: any) {
  const res = await request.json()
  console.log(res)
  const {userId, linkedinUrl, resumeUrl, bio, profilePicture, schoolId, companyId } = res;
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
      companyId,
    },
    create: {
      userId: userId,
      linkedinUrl,
      resumeUrl,
      bio,
      profilePicture,
      schoolId,
      companyId
    }
  })

  return NextResponse.json({result})
}