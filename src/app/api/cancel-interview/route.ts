import prisma from "@/lib/prisma";
import { InterviewStatus, RequestStatus } from "@prisma/client";
import { NextResponse } from "next/server"

export async function POST(request: any) {
  const res = await request.json()
  const { interviewId } = res;

   const updateRequest = await prisma.interview.update({
    where: {
      id: interviewId,
    },
    data: {
      status: InterviewStatus.CANCELLED,
    }
   })

  return NextResponse.json({ updateRequest })
}