'use client'

import React from 'react';
import { Button } from './ui/Button';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import CancelInterviewButton from './CancelInterviewButton';
import Link from 'next/link';

interface InterviewCardProps {
  candidate: User;
  interviewToken: string | null;
  scheduledTime: Date;
  interviewId: string;
}

const cancelInterview = async (interviewId: string) => {
  try {
    const res = await fetch('/api/create-interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        interviewId
      })
    });
  } catch (error) {
    console.error(error);
  }
}

const InterviewCard: React.FC<InterviewCardProps> = ({ interviewToken, candidate, scheduledTime, interviewId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <div className="border flex flex-col p-4 me-5 justify-between">
      <h2 className="name">{candidate.firstName} {candidate.lastName}</h2>
      <p className="occupation">{candidate.email}</p>
      <p className="occupation">{scheduledTime.toDateString()} @ {scheduledTime.toTimeString()}</p>
      {/* <p>Meeting URL: <a target='_blank' className='underline' href={"https://zoom.us/"}>https://zoom.us/</a> </p> */}
      <div className='mt-2'>
        {/* <CancelInterviewButton interviewId={interviewId} /> */}
        <Button className='ms-2' onClick={() => router.push(`/meeting/${interviewToken}`)}>Join Meeting</Button>
      </div>
      <div>
      </div>
    </div>
  );
};

export default InterviewCard;