import React from 'react';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { RequestStatus, UserRole, InterviewStatus } from '@prisma/client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/Card";

import { CalendarDateRangePicker } from "@/common/components/ui/DateRangePicker";
import { Overview } from "@/common/components/Overview";
import { Button } from "@/common/components/ui/Button";
import { ScrollArea } from "@/common/components/ui/ScrollArea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/components/ui/Tabs";
import { InterviewRequestListItem } from '@/common/components/InterviewRequestListItem';
import { InterviewListItem } from '@/common/components/InterviewListItem';
import { RecruitersForYou } from '@/common/components/RecruitersForYouItem';
import { redirect } from 'next/navigation';

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
      id: String(session?.user.id),
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
      profile: true
    }
  })
  return userData || [];
}

const Discover: React.FC<SessionProps> = async ({ session }) => {
  const recruiters = await getRecruiters();
  const userData = await getUserData();
  if (userData.profile === null) {
    redirect('/onboarding')
  }
  return (
    <div className='h-screen'>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Discover
            </h2>
            <div className="hidden md:flex items-center space-x-2">
              
            </div>
          </div>

          
          
        </div>
      </ScrollArea>
    </div>
  );
};

export default Discover;