import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

async function getPayments(userId: string) {
  const payments = await prisma.payment.findMany({
    where: {
      payeeId: userId,
    },
    select: {
      id: true,
      interview: {
        select: {
          candidate: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          scheduledTime: true,
          id: true
        }
      },
      amount: true,
      status: true,
      createdAt: true,
    }
  })

  return payments;
}

async function getUser(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      withdraws: true
    }
  })

  return user;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: `Invalid session` });
    }

    const client_id = process.env.PAYPAL_CLIENT_ID;
    const client_secret = process.env.PAYPAL_SECRET_KEY;
    
    // const res = await req.json();

    const userInfo = await getUser(session?.user.id);
    if (!userInfo.payoutEmail) {
      return NextResponse.json({ error: `No payout email set` });
    }

    const paymentInfo = await getPayments(session?.user.id);

    console.log(paymentInfo)

    const withdrawable = paymentInfo.filter((payment) => {
      return payment.status === PaymentStatus.COMPLETED
    })

    const totalAmount = withdrawable.reduce((acc, payment) => {
      return acc + payment.amount / 100;
    }, 0);

    const payoutRequest = {
      sender_batch_header: {
        sender_batch_id: "Payouts_2024_" + userInfo.firstName + "_" + userInfo.lastName + "_" + userInfo.withdraws.length + 1,
        email_subject: "You have a payout!",
        email_message: "You have received a payout! Thanks for using our service!"
      },
      items: [{
        recipient_type: "EMAIL",
        amount: { value: totalAmount, currency: "USD" },
        note: "Thanks for your patronage!",
        sender_item_id: userInfo.id,
        receiver: userInfo.payoutEmail,
      }]
    };

    // Create a Checkout Session
    const response = await fetch('https://api.paypal.com/v1/payments/payouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      body: JSON.stringify(payoutRequest)
    });

    try {
      const updatePayments = await prisma.payment.updateMany({
        where: {
          payeeId: session?.user.id,
          id: { in: withdrawable.map((item) => item.id) },
          status: PaymentStatus.COMPLETED
        },
        data: {
          status: PaymentStatus.WITHDRAWN
        }
      })

      // Create withdraw object
      const createWithdraw = await prisma.withdraws.create({
        data: {
          amount: totalAmount,
          userId: session?.user.id
        }
      })
    } catch (err) {
      console.error("Error in updating Prisma items")
      console.error(err);
    }
    
    if (!response.ok) {
      // Handles HTTP errors since fetch won't reject on HTTP error status even if the response is an HTTP 404 or 500.
      const errorData = await response.text();
      console.error(`PayPal API responded with status ${response.status}: ${errorData}`);
      return NextResponse.json({ error: `Failed to create payout session: ${errorData}` });
    }

    const sessionData = await response.json();
    console.log("Payout session created:", sessionData);

    return NextResponse.json({ success: true, sessionData });
  } catch (err: any) {
    console.error("Error creating payout session:", err.message);
    return NextResponse.json({ error: err.message });
  }
};
