import { Button } from '@/common/components/ui/Button';
import { $Enums, InterviewRequest, RequestStatus, UserRole } from '@prisma/client';
import React from 'react';
import prisma from '@/lib/prisma';
import BookTimeModal from '@/common/components/BookTimeModal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import CancelInterviewRequestButton from '@/common/components/CancelInterviewRequestButton';

export interface RecruiterUser {
  id: string;
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
  userId: string;
  linkedinUrl: string | null;
  resumeUrl: string | null;
  bio: string | null;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
}

async function getRecruiterUser(id: string) {
  try {
    const userIdTemp = id;
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
    const userIdTemp = id;
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

export async function generateMetadata({ params }: { params: { recruiterId: string } }) {
  const recruiterProfile = await getRecruiterProfile(params.recruiterId);
  const recruiterUser = await getRecruiterUser(params.recruiterId);
  return {
    title: `${recruiterUser?.firstName} ${recruiterUser?.lastName}`,
    description: recruiterProfile?.bio,
    image: recruiterProfile?.profilePicture,
    url: `https://mockbird.ai/recruiter/${params.recruiterId}`,
  }
}

const CandidateDashboard: React.FC<any> = async ({ params }: { params: { recruiterId: string } }) => {
  const recruiterProfile = await getRecruiterProfile(params.recruiterId);
  const recruiterUser = await getRecruiterUser(params.recruiterId);
  const session = await getServerSession(authOptions);

  let disableBookTime = false;
  let pendingRequest: InterviewRequest = {
    id: 0,
    candidateId: '0',
    recruiterId: '0',
    proposedTime: new Date(),
    purpose: '',
    status: RequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    paymentId: '',
  
  };

  if (recruiterUser?.recruiterRequests) {
    recruiterUser?.recruiterRequests.forEach((request) => {
      if (request.candidateId === session?.user.id) {
        disableBookTime = true;
        pendingRequest = request;
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
        
        {disableBookTime && pendingRequest &&(
          <div className='border p-5'>
            <h1>Request Info:</h1>
            <div>
              <p>Status: {pendingRequest?.status}</p>
              <p>Date: {pendingRequest?.proposedTime.toDateString()}</p>
              <p>Time: {pendingRequest?.proposedTime.toTimeString()}</p>
              <p>Purpose: {pendingRequest.purpose ? pendingRequest?.purpose : "N/A"}</p>
              <CancelInterviewRequestButton requestId={pendingRequest.id} />
            </div>
          </div>
        )}

    </div>
  );
};

export default CandidateDashboard;