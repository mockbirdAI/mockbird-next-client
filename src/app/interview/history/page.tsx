import { Button } from '@/common/components/ui/Button';
import { $Enums, InterviewStatus, UserRole } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/common/components/ui/Avatar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ScrollArea } from '@/common/components/ui/ScrollArea';

const getInterviews = async () => {
  const session = await getServerSession(authOptions);
  const meetings = await prisma.interview.findMany({
    where: {
      OR: [
        {
          candidateId: session?.user.id,
        },
        {
          recruiterId: session?.user.id
        }
      ],
      status: InterviewStatus.COMPLETED,
    }
  })
  return meetings;
}

const History: React.FC<any> = async () => {

  const meetings = await getInterviews();

  console.log(meetings);

  return (
    <div className='h-screen'>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Recordings
            </h2>
            <div className="hidden md:flex items-center space-x-2">
              
            </div>
          </div>
          
          <div>
            {meetings.map((meeting) => (
              <div key={meeting.id}>{meeting.id}</div>
            ))}
          </div>

          
          
        </div>
      </ScrollArea>
    </div>
  );
};

export default History;
