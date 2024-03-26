import { UserRole } from '@prisma/client';
import React from 'react';
import PersonCard from '../PersonCard';
import prisma from '@/lib/prisma';

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

const CandidateDashboard: React.FC<SessionProps> = async ({ session }) => {
  const recruiters = await getRecruiters();
  return (
    <div className="h-screen flex flex-col">
        <h2>Candidate Dashboard - welcome back {session?.user.firstName}</h2>

        <div className='flex flex-col'>
          <h1>All Recruiters</h1>
          <div>
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
          
        </div>
    </div>
  );
};

export default CandidateDashboard;