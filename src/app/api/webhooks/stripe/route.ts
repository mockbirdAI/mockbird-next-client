// pages/api/webhooks.js
import { headers } from "next/headers"
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const createInterviewRequest = async (candidateId: string, recruiterId: string, proposedTime: Date | null, purpose: string, paymentId: string, candidateEmail: string, recruiterEmail: string, candidateName: string, recruiterName: string) => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/create-interview-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        candidateId,
        recruiterId,
        purpose,
        proposedTime,
        paymentId, 
        candidateEmail,
        recruiterEmail,
        candidateName,
        recruiterName
      })
    });
  } catch (error) {
    console.error(error);
  }
}

export async function POST(req: any, res: NextResponse) {
    // const buf = await buffer(req);
    const signature = headers().get("stripe-signature") as string
    let event;
    const body = await req.text()

    try {
      event = stripe.webhooks.constructEvent(body, signature, String(webhookSecret));
    } catch (err: any) {
      console.log(`❌ Error message: ${err.message}`);
      return NextResponse.json(`Webhook Error: ${err.message}`);
    }

    console.log('✅ Success:', event.id);
    
    // switch (event.type) {
    //   case 'payment_intent.succeeded': {
    //     const session = event.data.object;
    //     const { candidateId, recruiterId, proposedTime, purpose } = session.metadata;
  
    //     // Here you can call your API to create an interview
    //     await createInterviewRequest(candidateId, recruiterId, new Date(proposedTime), purpose);
    //     break;
    //   }
    //   case 'payment_intent.payment_failed': {
    //     const paymentIntent = event.data.object;
    //     console.log(
    //       `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
    //     );
    //     break;
    //   }
    //   case 'charge.succeeded': {
    //     const charge = event.data.object;
    //     console.log(`Charge id: ${charge.id}`);
    //     break;
    //   }
    //   default: {
    //     console.warn(`Unhandled event type: ${event.type}`);
    //     break;
    //   }
    // }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { candidateId, recruiterId, proposedTime, purpose, candidateEmail, recruiterEmail, candidateName, recruiterName }: any = session.metadata;

      // Here you can call your API to create an interview
      try {
        await createInterviewRequest(candidateId, recruiterId, proposedTime, purpose, session.id, candidateEmail, recruiterEmail, candidateName, recruiterName);
      } catch (error) {
        console.error(error);
      }
    }

    return NextResponse.json({ received: true });
};