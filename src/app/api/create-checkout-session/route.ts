import { NextResponse, NextRequest } from "next/server"

// pages/api/create-checkout-session.js
import Stripe from 'stripe';
const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

export async function POST(req: NextRequest) {
  const res = await req.json()
  try {
    const { candidateId, recruiterId, proposedTime, price, purpose, recruiterName }: any = res;
    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Booking Time with ${recruiterName}`,
          },
          unit_amount: 50,  // Convert dollars to cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      // success_url: `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `${req.headers.get('origin')}/recruiter/${recruiterId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/recruiter/${recruiterId}`,
      metadata: {
        candidateId,
        recruiterId,
        proposedTime,
        purpose,
      },
    });
    return NextResponse.json({ sessionId: session.id })
  } catch (err: any) {
    console.error(err.message)
    return NextResponse.json({ error: err.message });
  }
};
