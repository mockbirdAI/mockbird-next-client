'use client'

import React from 'react';
import { Button } from './ui/Button';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';

interface PersonCardProps {
  candidate: User;
  proposedTime: Date;
}

const InterviewRequestCard: React.FC<PersonCardProps> = ({ candidate, proposedTime }) => {
  const router = useRouter();
  return (
    <div className="border flex flex-col p-4 me-5 justify-between">
      <h2 className="name">{candidate.firstName} {candidate.lastName}</h2>
      <p className="occupation">{candidate.email}</p>
      <p className="occupation">{String(proposedTime)}</p>
      <div>
        <Button 
          variant="default"
          onClick={() => alert("Accepted Interview!")}
        >
          Accept
        </Button>
      </div>
      
    </div>
  );
};

export default InterviewRequestCard;