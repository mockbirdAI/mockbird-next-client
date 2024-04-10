import prisma from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";
import { NextResponse } from "next/server"

export async function POST(request: any) {
  const res = await request.json()
  console.log(res)
  const {userId, linkedinUrl, resumeUrl, bio, profilePicture } = res;
  const result = await prisma.profile.upsert({
    where: {
      userId: userId,
    },
    update: {
      linkedinUrl,
      resumeUrl,
      bio,
      profilePicture,
    },
    create: {
      userId: userId,
      linkedinUrl,
      resumeUrl,
      bio,
      profilePicture,
    }
  })

  return NextResponse.json({result})
}