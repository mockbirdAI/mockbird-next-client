import prisma from "@/lib/prisma";
import { InterviewStatus, RequestStatus } from "@prisma/client";
import { NextResponse } from "next/server"

export async function POST(request: any) {
  const res = await request.json()
  console.log(res);
  const {candidateId, recruiterId, proposedTime, requestId } = res;

   const result = await prisma.interview.create({
    data: {
      candidateId,
      recruiterId,
      scheduledTime: proposedTime,
      duration: 60,
      status: InterviewStatus.SCHEDULED,
      requestId,
    }
   })

   const updateRequest = await prisma.interviewRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: RequestStatus.ACCEPTED
    }
   })

  return NextResponse.json({result, updateRequest})
}