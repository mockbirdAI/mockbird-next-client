import prisma from "@/lib/prisma";
import { EmailClient, KnownEmailSendStatus } from "@azure/communication-email";
import crypto from 'crypto';
import { NextResponse } from "next/server";

const sendPasswordResetEmail = async (emailClient: EmailClient, candidateEmail: any, resetUrl: string) => {
  const POLLER_WAIT_TIME = 10;
  const message = {
    senderAddress: "DoNotReply@mockbird.ai",
    recipients: {
      to: [{ address: candidateEmail }],
    },
    content: {
      subject: `Mockbird - Password Reset Request`,
      plainText: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="margin: auto; max-width: 600px; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
              <h1 style="color: #0056b3; text-align: center;">Password Reset Request</h1>
              <p style="font-size: 16px; line-height: 1.5;">
                You requested a password reset. Click the link below to reset your password:
              </p>
              <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; color: white; background-color: #0056b3; text-decoration: none; border-radius: 5px;">Reset Password</a>
              <p style="font-size: 16px; line-height: 1.5;">
                If you did not request a password reset, please ignore this email.
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
  };

  try {
    const poller = await emailClient.beginSend(message);
    if (!poller.getOperationState().isStarted) {
      throw "Poller was not started.";
    }
    
    let timeElapsed = 0;

    while (!poller.isDone) {
      poller.poll();
      console.log("Email send polling in progress");

      await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
      timeElapsed += 10;

      if (timeElapsed > 18 * POLLER_WAIT_TIME) {
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
};

export async function POST(request: any) {
  const { email } = await request.json();
  
  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiry

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  
  const connectionString = process.env.AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING;
  const emailClient = new EmailClient(String(connectionString));
  
  try {
    const sendEmail = await sendPasswordResetEmail(emailClient, email, resetUrl);
    return NextResponse.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error });
  }
}
