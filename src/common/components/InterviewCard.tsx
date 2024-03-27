'use client'

import React from 'react';
import { Button } from './ui/Button';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';

interface InterviewRequestCardProps {
  candidate: User;
  scheduledTime: Date;
  requestId: number;
}

const createInterview = async (candidateId: number, recruiterId: number, scheduledTime: Date, requestId: number) => {
  try {
    const res = await fetch('/api/create-interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        candidateId,
        recruiterId,
        scheduledTime,
        requestId
      })
    });
  } catch (error) {
    console.error(error);
  }
}

const InterviewRequestCard: React.FC<InterviewRequestCardProps> = ({ candidate, scheduledTime, requestId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <div className="border flex flex-col p-4 me-5 justify-between">
      <h2 className="name">{candidate.firstName} {candidate.lastName}</h2>
      <p className="occupation">{candidate.email}</p>
      <p className="occupation">{scheduledTime.toDateString()} @ {scheduledTime.toTimeString()}</p>
      <div>
      </div>
    </div>
  );
};

export default InterviewRequestCard;