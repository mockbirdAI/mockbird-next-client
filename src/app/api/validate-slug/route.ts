import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'No slug passed in' })
  }
  // const session = getServerSession(authOptions);
  const check = await prisma.profile.findFirst({
    where: {
      OR: [
        {
          slug: slug
        },
        {
          user: {
            id: slug
          }
        }
      ]
    }
  })

  return NextResponse.json({ valid: check == null, error: '' })
}