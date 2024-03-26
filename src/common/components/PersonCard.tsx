'use client'

import React from 'react';
import { Button } from './ui/Button';
import { useRouter } from 'next/navigation';

interface PersonCardProps {
  userId: number;
  profilePicture: string;
  firstName: string;
  lastName: string;
  role: string;
}

const PersonCard: React.FC<PersonCardProps> = ({ userId, profilePicture, firstName, lastName, role }) => {
  const router = useRouter();
  return (
    <div className="border flex flex-row p-4 me-5 justify-between">
      <img src={profilePicture} alt="Profile Picture" className="profile-picture" />
      <h2 className="name">{firstName} {lastName}</h2>
      <p className="occupation">{role}</p>
      <Button 
        variant="default"
        onClick={() => router.push(`/recruiter/${userId}`)}
      >
        View Profile
      </Button>
    </div>
  );
};

export default PersonCard;