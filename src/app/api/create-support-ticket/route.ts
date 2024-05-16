import prisma from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";
import { NextResponse } from "next/server"
import { EmailClient, KnownEmailSendStatus } from "@azure/communication-email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const sendSupportTicketConfirmation = async (emailClient: EmailClient, email: string, name: string) => {
  const POLLER_WAIT_TIME = 10

  const message = {
    senderAddress: "DoNotReply@mockbird.ai",
    recipients: {
      to: [{ address: email }],
    },
    content: {
      subject: `Mockbird - Support Ticket Received`,
      plainText: `We are sending this as a confirmation for your support ticket.`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="margin: auto; max-width: 600px; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
              <h1 style="color: #0056b3; text-align: center;">Interview Request</h1>
              <p style="font-size: 16px; line-height: 1.5;">
                Hi ${name},
              </p>
              <p style="font-size: 16px; line-height: 1.5;">
              We are sending this as a confirmation for your support ticket. We will review as soon as possible and contact you accordingly. No further action is needed on your part.</strong>.
              </p>
              <p style="font-size: 16px; line-height: 1.5;">
                Best regards,<br>
                The Mockbird Team
              </p>
            </div>
          </body>
        </html>
      `,
    }
  }


  try {
    const poller = await emailClient.beginSend(message);
    if (!poller.getOperationState().isStarted) {
      throw "Poller was not started."
    }
    
    let timeElasped = 0;

    while (!poller.isDone) {
      poller.poll()
      console.log("Email send polling in progress")

      await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
      timeElasped += 10;

      if (timeElasped > 18 * POLLER_WAIT_TIME) {
        throw "Polling timed out";
      }
    }

    if (poller.getResult()?.status === KnownEmailSendStatus.Succeeded) {
      console.log(`Successfully sent the email (operation id: ${poller.getResult()?.id})`);
    } else {
      throw poller.getResult()?.error;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function POST(request: any) {
  const res = await request.json()
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ error: "No session found" })
  }
  const { 
    email,
    name,
    category,
    message,
  } = res;

  const result = await prisma.supportTicket.create({
    data: {
      senderEmail: email,
      message: message,
      userId: session?.user.id,
      category: category,
      name: name
    }
  })

  const connectionString = process.env.AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING;
  const emailClient = new EmailClient(String(connectionString));

  try {
    const response = await sendSupportTicketConfirmation(emailClient, email, name);
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json({result})
}