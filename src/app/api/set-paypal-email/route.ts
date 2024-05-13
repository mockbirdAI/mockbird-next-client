import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"

export async function POST(request: any) {
  const res = await request.json()
  const { email } = res;
  const session = await getServerSession(authOptions)

   const updateRequest = await prisma.user.update({
    where: {
      id: session?.user.id,
    },
    data: {
      payoutEmail: email
    }
   })

  return NextResponse.json({ updateRequest })
}