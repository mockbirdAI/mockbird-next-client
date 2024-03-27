import React from 'react';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import InterviewRequestCard from '../InterviewRequestCard';

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
          candidate: true
        }
      },
      recruiterInterviews: {
        include: {
          candidate: true
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
        <h2>Recruiter Dashboard - welcome back {session?.user.firstName}</h2>
        
        <div className='flex flex-col'>
          
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
                      />
                    </li>
                  )
                }, [])}
              </ul>
            </div>
            <div className='w-1/2'>
              <h1>Accepted Interviews</h1>
            </div>
          </div>
          
        </div>
    </div>
  );
};

export default CandidateDashboard;