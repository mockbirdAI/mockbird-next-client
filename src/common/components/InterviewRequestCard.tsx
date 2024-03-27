'use client'

import React from 'react';
import { Button } from './ui/Button';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';

interface InterviewRequestCardProps {
  candidate: User;
  proposedTime: Date;
  requestId: number;
}

const acceptInterview = async (candidateId: number, recruiterId: number, proposedTime: Date, requestId: number) => {
  try {
    const res = await fetch('/api/accept-interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        candidateId,
        recruiterId,
        proposedTime,
        requestId
      })
    });
  } catch (error) {
    console.error(error);
  }
}

const declineInterview = async (requestId: number) => {
  try {
    const res = await fetch('/api/decline-interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requestId
      })
    });
  } catch (error) {
    console.error(error);
  }
}

const InterviewRequestCard: React.FC<InterviewRequestCardProps> = ({ candidate, proposedTime, requestId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <div className="border flex flex-col p-4 me-5 justify-between">
      <h2 className="name">{candidate.firstName} {candidate.lastName}</h2>
      <p className="occupation">{candidate.email}</p>
      <p className="occupation">{proposedTime.toDateString()} @ {proposedTime.toTimeString()}</p>
      <div className='d-flex flex-col mt-3'>
        <Button 
          variant="default"
          onClick={async () => {
            console.log("ACCEPTED INTERVIEW");
            await acceptInterview(candidate.id, Number(session?.user.id), proposedTime, requestId);
            router.refresh();
          }}
        >
          Accept
        </Button>
        <Button 
          variant="outline"
          className='ms-2'
          onClick={async () => {
            console.log("Decline INTERVIEW");
            await declineInterview(requestId);
            router.refresh();
          }}
        >
          Decline
        </Button>
      </div>
      
    </div>
  );
};

export default InterviewRequestCard;