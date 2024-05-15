import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"

export async function POST(request: any) {
  const res = await request.json()
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Invalid session' })
  }
  const { 
    firstName, 
    lastName,
    about,
    location,
    linkedinUrl,
    slug
  } = res;

   const updateRequest = await prisma.user.update({
    where: {
      id: session?.user.id,
    },
    data: {
      firstName,
      lastName,
      profile: {
        update: {
          bio: about,
          currentLocation: location,
          linkedinUrl,
          slug
        },
      }
    }
   })

  return NextResponse.json({ updateRequest })
}