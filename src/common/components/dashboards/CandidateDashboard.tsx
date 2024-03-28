import { InterviewStatus, RequestStatus, UserRole } from '@prisma/client';
import React from 'react';
import PersonCard from '../PersonCard';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import InterviewCard from '../InterviewCard';
import InterviewRequestCard from '../InterviewRequestCard';

interface SessionProps {
  session: any;
}

async function getRecruiters() {
  const recruiters = await prisma.user.findMany({
    where: {
      role: UserRole.RECRUITER
    }
  })
  return recruiters || [];
}

async function getUserData() {
  const session = await getServerSession(authOptions);
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: Number(session?.user.id),
      role: UserRole.CANDIDATE
    },
    include: {
      candidateRequests: {
        include: {
          recruiter: true,
        },
        where: {
          status: RequestStatus.PENDING
        }
      },
      candidateInterviews: {
        include: {
          recruiter: true
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
  const recruiters = await getRecruiters();
  const userData = await getUserData();
  return (
    <div className="h-screen flex flex-col">
      <div className='flex justify-center'>
        <h2>Candidate Dashboard - Welcome Back {session?.user.firstName}!</h2>
      </div>

      <div className='flex flex-row justify-between m-10'>
        <div className=''>
          <h1>All Recruiters</h1>
          <ul>
            {recruiters?.map((recruiter) => {
              return (
                <li key={recruiter.id}>
                  <PersonCard 
                    userId={recruiter.id}
                    profilePicture="" 
                    firstName={recruiter.firstName} 
                    lastName={recruiter.lastName} 
                    role={recruiter.role} 
                  />
                </li>
              )
            }, [])}
          </ul>
        </div>
        
        <div className=''>
          <h1>Accepted Interviews</h1>
          <ul>
            {userData.candidateInterviews?.map((interview) => {
              return (
                <li key={interview.id}>
                  <InterviewCard 
                    interviewToken={interview.userToken}
                    candidate={interview.recruiter}
                    scheduledTime={interview.scheduledTime}
                    interviewId={interview.id}
                  />
                </li>
              )
            }, [])}
          </ul>
        </div>
        <div className=''>
            <h1>Pending Requests</h1>
            <ul>
              {userData.candidateRequests?.map((request) => {
                return (
                  <li key={request.id}>
                    <InterviewRequestCard 
                      candidate={request.recruiter}
                      proposedTime={request.proposedTime}
                      requestId={request.id}
                    />
                  </li>
                )
              }, [])}
            </ul>
          </div>
        </div>
    </div>
  );
};

export default CandidateDashboard;