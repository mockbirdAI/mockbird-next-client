import { Button } from '@/common/components/ui/Button';
import { $Enums, UserRole } from '@prisma/client';
import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';

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

async function getUser(id: string) {
  try {
    const userIdTemp = id;
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userIdTemp,
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

const CandidateProfile: React.FC<any> = async ({ candidateUser, candidateProfile }: any) => {
  if (!candidateProfile || !candidateUser) {
    return <div className='h-screen'>404. Profile Not Found</div>
  }
  return (
    <div className="h-screen flex flex-col">
        <h2>PROFILE</h2>
        <h2>{candidateUser?.firstName} {candidateUser?.lastName}</h2>
        <h2>{candidateProfile?.bio}</h2>
        <Link target='_blank' href={candidateProfile?.linkedinUrl}>{candidateProfile?.linkedinUrl}</Link>

    </div>
  );
};

const RecruiterProfile: React.FC<any> = async ({ recruiterUser, recruiterProfile }: any) => {
  if (!recruiterProfile || !recruiterUser) {
    return <div className='h-screen'>404. Profile Not Found</div>
  }
  return (
    <div className="h-screen flex flex-col">
        <h2>PROFILE</h2>
        <h2>{recruiterUser?.firstName} {recruiterUser?.lastName}</h2>
        <h2>{recruiterProfile?.bio}</h2>
        <Link target='_blank' href={recruiterProfile?.linkedinUrl}>{recruiterProfile?.linkedinUrl}</Link>
    </div>
  );
};

const Profile: React.FC<any> = async ({ params }: { params: { userId: string } }) => {
  const user = await getUser(params.userId);
  const profile = user?.profile;

  if (user?.role == UserRole.CANDIDATE) {
    return <CandidateProfile candidateUser={user} candidateProfile={profile} />
  } else if (user?.role == UserRole.RECRUITER) {
    return <RecruiterProfile recruiterUser={user} recruiterProfile={profile} />
  } else {
    return <div className='h-screen'>404. Profile Not Found</div>
  }

};

export default Profile;