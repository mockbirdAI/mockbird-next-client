import React from 'react';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { RequestStatus, UserRole, InterviewStatus } from '@prisma/client';
import InterviewRequestCard from '../InterviewRequestCard';
import InterviewCard from '../InterviewCard';

interface SessionProps {
  session: any;
}

async function getUserData() {
  const session = await getServerSession(authOptions);
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: Number(session?.user.id),
      role: UserRole.RECRUITER
    },
    include: {
      recruiterRequests: {
        include: {
          candidate: true,
        },
        where: {
          status: RequestStatus.PENDING
        }
      },
      recruiterInterviews: {
        include: {
          candidate: true
        },
        where: {
          status: InterviewStatus.SCHEDULED
        }
      },
    }
  })
  return userData || [];
}

const CandidateDashboard: React.FC<SessionProps> = async ({ session }) => {
  const userData = await getUserData();
  return (
    <div className="h-screen">
      <div className='flex justify-center'>
        <h2>Recruiter Dashboard - Welcome Back {session?.user.firstName}!</h2>
      </div>        
      <div className='flex flex-col m-10'>
        <div className='flex flex-row'>
          <div className='w-1/2'>
            <h1>Candidate Requests</h1>
            <ul>
              {userData.recruiterRequests?.map((request) => {
                return (
                  <li key={request.id}>
                    <InterviewRequestCard 
                      candidate={request.candidate}
                      proposedTime={request.proposedTime}
                      requestId={request.id}
                    />
                  </li>
                )
              }, [])}
            </ul>
          </div>
          <div className='w-1/2'>
            <h1>Accepted Interviews</h1>
            <ul>
              {userData.recruiterInterviews?.map((interview) => {
                return (
                  <li key={interview.id}>
                    <InterviewCard 
                      interviewToken={interview.hostToken}
                      candidate={interview.candidate}
                      scheduledTime={interview.scheduledTime}
                      interviewId={interview.id}
                    />
                  </li>
                )
              }, [])}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;