import { Button } from '@/common/components/ui/Button';
import { UserRole } from '@prisma/client';
import React from 'react';

async function getRecruiterUser(id: string) {
  const userIdTemp = Number(id);
  const recruiters = await prisma?.user.findUniqueOrThrow({
    where: {
      id: userIdTemp
    }
  })
  return recruiters;
}

async function getRecruiterProfile(id: string) {
  const userIdTemp = Number(id);
  const recruiters = await prisma?.profile.findUniqueOrThrow({
    where: {
      userId: userIdTemp
    }
  })
  return recruiters;
}

const CandidateDashboard: React.FC<any> = async ({ params }: { params: { recruiterId: string } }) => {
  const recruiterProfile = await getRecruiterProfile(params.recruiterId);
  const recruiterUser = await getRecruiterUser(params.recruiterId)
  return (
    <div className="h-screen flex flex-col">
        <h2>PROFILE</h2>
        <h2>{recruiterUser?.firstName} {recruiterUser?.lastName}</h2>
        <h2>{recruiterProfile?.bio}</h2>
        <h2>{recruiterProfile?.linkedinUrl}</h2>
        <div>
          <Button variant="default">
            Book Time
          </Button>
        </div>

    </div>
  );
};

export default CandidateDashboard;