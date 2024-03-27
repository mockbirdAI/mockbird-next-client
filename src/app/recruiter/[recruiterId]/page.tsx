import { Button } from '@/common/components/ui/Button';
import { $Enums, RequestStatus, UserRole } from '@prisma/client';
import React from 'react';
import prisma from '@/lib/prisma';
import BookTimeModal from '@/common/components/BookTimeModal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface RecruiterUser {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: $Enums.UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecruiterProfile {
  id: number;
  userId: number;
  linkedinUrl: string | null;
  resumeUrl: string | null;
  bio: string | null;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
}

async function getRecruiterUser(id: string) {
  try {
    const userIdTemp = Number(id);
    const recruiters = await prisma.user.findUniqueOrThrow({
      where: {
        id: userIdTemp,
        role: UserRole.RECRUITER
      },
      include: {
        recruiterRequests: {
          where: {
            status: RequestStatus.PENDING
          }
        },
        recruiterInterviews: true,
      }
    })
  return recruiters;
  } catch (error) {
    return null;
  }
}

async function getRecruiterProfile(id: string) {
  try {
    const userIdTemp = Number(id);
    const recruiters = await prisma.profile.findUniqueOrThrow({
      where: {
        userId: userIdTemp,
      }
    })
  return recruiters;
  } catch (error) {
    console.error(error)
    return null;
  }
}

const CandidateDashboard: React.FC<any> = async ({ params }: { params: { recruiterId: string } }) => {
  const recruiterProfile = await getRecruiterProfile(params.recruiterId);
  const recruiterUser = await getRecruiterUser(params.recruiterId);
  const session = await getServerSession(authOptions);

  let disableBookTime = false;

  if (recruiterUser?.recruiterRequests) {
    recruiterUser?.recruiterRequests.forEach((request) => {
      if (request.candidateId === Number(session?.user.id)) {
        disableBookTime = true;
      }
    });
  }

  if (!recruiterProfile || !recruiterUser) {
    return <div className='h-screen'>404. Profile Not Found</div>
  }
  return (
    <div className="h-screen flex flex-col">
        <h2>PROFILE</h2>
        <h2>{recruiterUser?.firstName} {recruiterUser?.lastName}</h2>
        <h2>{recruiterProfile?.bio}</h2>
        <h2>{recruiterProfile?.linkedinUrl}</h2>
        <div>
          <BookTimeModal disabled={disableBookTime} recruiterUser={recruiterUser} recruiterProfile={recruiterProfile} />
        </div>

    </div>
  );
};

export default CandidateDashboard;