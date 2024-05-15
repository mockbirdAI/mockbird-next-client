import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Invalid session' })
  }
  // const session = getServerSession(authOptions);
  const slug = await prisma.profile.findFirst({
    where: {
      userId: session?.user.id
    },
    select: {
      slug: true
    }
  })
  return NextResponse.json({ slug })
}