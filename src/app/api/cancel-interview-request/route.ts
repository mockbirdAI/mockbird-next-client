import prisma from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";
import { NextResponse } from "next/server"
import Stripe from "stripe";

export async function POST(request: any) {
  const res = await request.json()
  const { requestId } = res;

   try {
    const interviewReq = await prisma.interviewRequest.findUniqueOrThrow({
      where: {
        id: requestId,
      },
      select: {
        paymentId: true,
        stripeSessionId: true
      }
    });

    if (interviewReq.paymentId) {
      const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
      try {
        const paymentInt = await stripe.checkout.sessions.expire(interviewReq.stripeSessionId);
      } catch (err) {
        console.error(err);
      }
    }

    const updateRequest = await prisma.interviewRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: RequestStatus.CANCELLED,
      }
     })

    return NextResponse.json({ updateRequest })
  } catch (err) {
    console.error(err);
    throw err;
  }
}