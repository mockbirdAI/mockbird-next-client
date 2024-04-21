import React from 'react';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { RequestStatus, UserRole, InterviewStatus } from '@prisma/client';
import { ScrollArea } from "@/common/components/ui/ScrollArea";
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import AvailabilityCalendar from '@/common/components/AvailabilityCalendar';

const Discover: React.FC = async () => {
  const session = await getServerSession(authOptions)
  if (session && session?.user.role !== UserRole.RECRUITER) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <h1 className='text-3xl font-bold'>You are not authorized to view this page</h1>
      </div>
    )
  }

  return (
    <div className='h-screen'>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Availability
            </h2>
            <div className="hidden md:flex items-center space-x-2">
              
            </div>
          </div>

          <div>
            <AvailabilityCalendar />
          </div>
          
        </div>
      </ScrollArea>
    </div>
  );
};

export default Discover;