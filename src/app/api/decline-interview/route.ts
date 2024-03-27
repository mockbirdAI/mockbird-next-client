import prisma from "@/lib/prisma";
import { InterviewStatus, RequestStatus } from "@prisma/client";
import { NextResponse } from "next/server"

export async function POST(request: any) {
  const res = await request.json()
  const { requestId } = res;

   const updateRequest = await prisma.interviewRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: RequestStatus.DECLINED,
    }
   })

  return NextResponse.json({ updateRequest })
}