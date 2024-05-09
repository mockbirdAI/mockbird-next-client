import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const client_id = process.env.PAYPAL_CLIENT_ID;
    const client_secret = process.env.PAYPAL_SECRET_KEY;
    // const res = await req.json();
    const payoutRequest = {
      sender_batch_header: {
        sender_batch_id: "Payouts_2020_100007",
        email_subject: "You have a payout!",
        email_message: "You have received a payout! Thanks for using our service!"
      },
      items: [{
        recipient_type: "EMAIL",
        amount: { value: "0.50", currency: "USD" },
        note: "Thanks for your patronage!",
        sender_item_id: "201403140001",
        receiver: "mrrickyliao@gmail.com",
      }]
    };

    // Create a Checkout Session
    const response = await fetch('https://api-m.sandbox.paypal.com/v1/payments/payouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      body: JSON.stringify(payoutRequest)
    });

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
