import prisma from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";
import { NextResponse } from "next/server"

export async function POST(request: any) {
  const res = await request.json()
  console.log(res);
  const {candidateId, recruiterId, proposedTime, purpose } = res;
  const result = await prisma.interviewRequest.create({
    data: {
      candidateId,
      recruiterId,
      proposedTime,
      purpose,
      status: RequestStatus.PENDING,
    }
  })

  return NextResponse.json({result})
}