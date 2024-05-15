import prisma from "@/lib/prisma";
import { InterviewStatus, PaymentStatus, RequestStatus } from "@prisma/client";
import { NextResponse } from "next/server"
import { EmailClient, KnownEmailSendStatus } from "@azure/communication-email";
import Stripe from 'stripe';

const sendAcceptedInterviewEmail = async (emailClient: EmailClient, candidateEmail: string, candidateName: string, recruiterName: string, proposedTime: string) => {
  const POLLER_WAIT_TIME = 10

  const message = {
    senderAddress: "DoNotReply@mockbird.ai",
    recipients: {
      to: [{ address: candidateEmail }],
    },
    content: {
      subject: `Mockbird - Interview Accepted with ${recruiterName}`,
      plainText: `Your interview request has been accepted with ${recruiterName} for ${proposedTime}. Please see the details in the attached email.`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="margin: auto; max-width: 600px; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
              <h1 style="color: #0056b3; text-align: center;">Interview Scheduled</h1>
              <p style="font-size: 16px; line-height: 1.5;">
                Hi ${candidateName},
              </p>
              <p style="font-size: 16px; line-height: 1.5;">
                Your interview request with <strong>${recruiterName}</strong> has been accepted.
              </p>
              <div style="background-color: #f8f8f8; padding: 15px; margin: 20px 0; border-left: 5px solid #0056b3;">
                <p style="margin: 0; font-size: 16px;"><strong>Recruiter:</strong> ${recruiterName}</p>
                <p style="margin: 0; font-size: 16px;"><strong>Time:</strong> ${proposedTime}</p>
              </div>
              <p style="font-size: 16px; line-height: 1.5;">
                Please join at the scheduled start time on Mockbird.
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
  const {candidateId, recruiterId, proposedTime, requestId, candidateEmail, candidateName, recruiterName, dateString } = res;
  // DYTE

  let paymentInt;

  const dyteAuth = btoa(`${process.env.DYTE_ORG_ID}:${process.env.DYTE_API_KEY}`)

  let dyteMeetingId;
  let hostToken;
  let userToken;

  try {
    const interviewReq = await prisma.interviewRequest.findUniqueOrThrow({
      where: {
        id: requestId,
      },
      select: {
        paymentId: true
      }
    });


    if (interviewReq.paymentId) {
      const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
      try {
        paymentInt = await stripe.paymentIntents.capture(interviewReq.paymentId);
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
  

  const meetingURL = 'https://api.dyte.io/v2/meetings';

  const optionBody = {
    "title": "string",
    "preferred_region": "us-east-1",
    "record_on_start": true,
    "live_stream_on_start": false,
    "recording_config": {
      "max_seconds": 3600,
      "file_name_prefix": String(candidateId),
      "video_config": {
        "codec": "H264",
        "width": 1280,
        "height": 720,
        "watermark": {
          "url": "https://mockbird.ai",
          "size": {
            "width": 1,
            "height": 1
          },
          "position": "left top"
        },
        "export_file": true
      },
      "audio_config": {
        "codec": "AAC",
        "channel": "stereo",
        "export_file": false
      },
      "storage_config": {
        "type": "azure",
        "access_key": process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY,
        "secret": "string",
        "bucket": "mockbirdmeetings",
        "region": "us-east-1",
        "path": "string",
        "auth_method": "KEY",
        "username": "string",
        "password": "string",
        "host": "string",
        "port": 0,
        "private_key": "string"
      },
      "dyte_bucket_config": {
        "enabled": true
      },
      "live_streaming_config": {
        "rtmp_url": "rtmp://a.rtmp.youtube.com/live2"
      }
    }
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${dyteAuth}`
    },
    body: JSON.stringify(optionBody)
  };
  
  try {
    const response = await fetch(meetingURL, options);
    const data = await response.json();
    dyteMeetingId = data.data.id;
  } catch (error) {
    console.error(error);
  }

  const addParticipantURL = `https://api.dyte.io/v2/meetings/${dyteMeetingId}/participants`;
  const addHostOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${dyteAuth}`
    },
    body: '{"name":"Interviewer","picture":"https://i.imgur.com/test.jpg","preset_name":"group_call_host","custom_participant_id":"InterviewerId"}'
  };

  const addUserOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${dyteAuth}`
    },
    body: '{"name":"Candidate","picture":"https://i.imgur.com/test.jpg","preset_name":"group_call_participant","custom_participant_id":"CandidateId"}'
  };

  try {
    const addHostResponse = await fetch(addParticipantURL, addHostOptions);
    const addUserResponse = await fetch(addParticipantURL, addUserOptions);
    const addHostData = await addHostResponse.json();
    const addUserData = await addUserResponse.json();
    hostToken = String(addHostData.data.token);
    userToken = String(addUserData.data.token);
  } catch (error) {
    console.error(error);
  }

  // END DYTE

  const interviewObject = await prisma.interview.create({
    data: {
      id: String(dyteMeetingId),
      candidateId,
      recruiterId,
      scheduledTime: proposedTime,
      duration: 60,
      status: InterviewStatus.SCHEDULED,
      requestId,
      hostToken: hostToken,
      userToken: userToken
    }
  })

  if (paymentInt) {
    try {
      const paymentObject = await prisma.payment.create({
        data: {
          paymentIntentId: paymentInt.id,
          payerId: candidateId,
          payeeId: recruiterId,
          amount: paymentInt.amount,
          status: PaymentStatus.PENDING,
          interviewId: interviewObject.id
        }
      })
    } catch (err) {
      throw err;
    }
  }

  const updateRequest = await prisma.interviewRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: RequestStatus.ACCEPTED
    }
  })

  const connectionString = process.env.AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING;
  const emailClient = new EmailClient(String(connectionString));

  try {
    const response = await sendAcceptedInterviewEmail(emailClient, candidateEmail, candidateName, recruiterName, dateString);
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json({interviewObject, updateRequest})
}