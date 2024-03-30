import { Button } from '@/common/components/ui/Button';
import { $Enums, UserRole } from '@prisma/client';
import React from 'react';
import prisma from '@/lib/prisma';

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: $Enums.UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: number;
  userId: number;
  linkedinUrl: string | null;
  resumeUrl: string | null;
  bio: string | null;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
}

async function getCandidate(id: string) {
  try {
    const userIdTemp = Number(id);
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userIdTemp,
        role: UserRole.CANDIDATE
      },
      include: {
        profile: true
      }
    })
  return user;
  } catch (error) {
    return null;
  }
}

const CandidateDashboard: React.FC<any> = async ({ params }: { params: { userId: string } }) => {
  console.log(params.userId)
  const candidateUser = await getCandidate(params.userId);
  const candidateProfile = candidateUser?.profile;

  if (!candidateProfile || !candidateUser) {
    return <div className='h-screen'>404. Profile Not Found</div>
  }
  return (
    <div className="h-screen flex flex-col">
        <h2>PROFILE</h2>
        <h2>{candidateUser?.firstName} {candidateUser?.lastName}</h2>
        <h2>{candidateProfile?.bio}</h2>
        <h2>{candidateProfile?.linkedinUrl}</h2>

    </div>
  );
};

export default CandidateDashboard;