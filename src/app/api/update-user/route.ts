import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function POST(request: any) {
  const res = await request.json()
  const { userId, role } = res;

   const updateRequest = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: role,
    }
   })

  return NextResponse.json({ updateRequest })
}