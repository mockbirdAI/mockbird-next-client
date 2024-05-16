import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PaymentStatus, UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"

export async function POST(request: any) {
  const res = await request.json()
  const { paymentId, paymentIntentId } = res;

  const session = await getServerSession(authOptions);

  if (session?.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Permission Mismatch" })
  } 

  try {
    const updateRequest = await prisma.payment.update({
      where: {
        id: paymentId,
        paymentIntentId: paymentIntentId,
        status: PaymentStatus.PENDING
      },
      data: {
        status: PaymentStatus.COMPLETED
      }
    })
    return NextResponse.json({ updateRequest })
  } catch (error) {
    console.error(error);
    throw error

  }

}