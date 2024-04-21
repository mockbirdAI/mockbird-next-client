'use client'

import React from 'react';
import { Button } from './ui/Button';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useToast } from './ui/use-toast';

interface InterviewRequestCardProps {
  candidate: User;
  proposedTime: Date;
  requestId: number;
}

const acceptInterview = async (candidateId: string, recruiterId: string, proposedTime: Date, requestId: number, candidateEmail: string, candidateName: string, recruiterName: string, dateString: string) => {
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
        requestId,
        candidateEmail,
        candidateName,
        recruiterName,
        dateString,
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
  const { toast } = useToast();
  return (
    <div className="border flex flex-col p-4 me-5 justify-between">
      <h2 className="name">{candidate.firstName} {candidate.lastName}</h2>
      <p className="occupation">{candidate.email}</p>
      <p className="occupation">{proposedTime.toDateString()} @ {proposedTime.toTimeString()}</p>
      <div className='d-flex flex-col mt-3'>
        <Button 
          variant="default"
          onClick={async () => {
            await acceptInterview(candidate.id, String(session?.user.id), proposedTime, requestId, candidate.email, candidate.firstName + candidate.lastName, `${String(session?.user.firstName)} ${String(session?.user.lastName)}`, proposedTime.toDateString());
            toast({
              title: 'Interview Request Accepted',
              description: 'You have accepted the interview request!',
            });
            router.refresh();
          }}
        >
          Accept
        </Button>
        <Button 
          variant="outline"
          className='ms-2'
          onClick={async () => {
            await declineInterview(requestId);
            toast({
              title: 'Interview Request Declined',
              description: 'You have declined the interview request!',
            });
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