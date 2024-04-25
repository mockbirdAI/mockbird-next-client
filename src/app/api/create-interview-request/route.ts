import prisma from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";
import { NextResponse } from "next/server"
import { EmailClient, KnownEmailSendStatus } from "@azure/communication-email";

const sendInterviewRequestEmail = async (emailClient: EmailClient, recruiterEmail: string, candidateEmail: string, candidateName: string, recruiterName: string, proposedTime: string, purpose: string) => {
  const POLLER_WAIT_TIME = 10

  const message = {
    senderAddress: "DoNotReply@mockbird.ai",
    recipients: {
      to: [{ address: recruiterEmail }],
    },
    content: {
      subject: `Mockbird - New Interview Request from ${candidateName}`,
      plainText: `You have a new interview request from ${candidateName} for ${proposedTime} for the purpose of ${purpose}. Please see the details in the attached email.`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="margin: auto; max-width: 600px; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
              <h1 style="color: #0056b3; text-align: center;">Interview Request</h1>
              <p style="font-size: 16px; line-height: 1.5;">
                Hi ${recruiterName},
              </p>
              <p style="font-size: 16px; line-height: 1.5;">
                You have received a new interview request from <strong>${candidateName}</strong>.
              </p>
              <div style="background-color: #f8f8f8; padding: 15px; margin: 20px 0; border-left: 5px solid #0056b3;">
                <p style="margin: 0; font-size: 16px;"><strong>Candidate:</strong> ${candidateName}</p>
                <p style="margin: 0; font-size: 16px;"><strong>Time:</strong> ${proposedTime}</p>
                <p style="margin: 0; font-size: 16px;"><strong>Purpose:</strong> ${purpose}</p>
              </div>
              <p style="font-size: 16px; line-height: 1.5;">
                Please confirm your availability on your recruiter dashboard.
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
  console.log(res);
  const { 
    candidateId, 
    recruiterId, 
    proposedTime, 
    purpose, 
    paymentId,
    stripeSessionId,
    recruiterEmail, 
    candidateEmail, 
    candidateName,
    recruiterName 
  } = res;
  const result = await prisma.interviewRequest.create({
    data: {
      candidateId,
      recruiterId,
      proposedTime,
      purpose,
      status: RequestStatus.PENDING,
      paymentId,
      stripeSessionId
    }
  })

  const dateString = new Date(proposedTime).toDateString();

  const connectionString = process.env.AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING;
  const emailClient = new EmailClient(String(connectionString));

  try {
    const response = await sendInterviewRequestEmail(emailClient, recruiterEmail, candidateEmail, candidateName, recruiterName, dateString, purpose);
    console.log(response);
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json({result})
}