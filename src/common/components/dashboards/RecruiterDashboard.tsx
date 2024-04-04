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
import { InterviewRequestListItem } from '../InterviewRequestListItem';
import { InterviewListItem } from '../InterviewListItem';

interface SessionProps {
  session: any;
}

async function getUserData() {
  const session = await getServerSession(authOptions);
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: String(session?.user.id),
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
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Hi {session?.user.firstName}, Welcome back 👋
            </h2>
            <div className="hidden md:flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requests">
                Requests
              </TabsTrigger>
              <TabsTrigger value="interviews">
                Interviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$0.00</div>
                    <p className="text-xs text-muted-foreground">
                      +0.0% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Interviews Completed
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">
                      +0.0% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">StealthXI Score</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">
                      +0.0% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Reviews
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">6</div>
                    <p className="text-xs text-muted-foreground">
                      +0 since last hour
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-4 md:col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Interviews</CardTitle>
                    <CardDescription>
                      You have {userData.recruiterInterviews.length} interview{userData.recruiterInterviews.length == 1 ? "" : "s"} upcoming.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {userData.recruiterInterviews.length === 0 ? (
                        <p>No upcoming interviews at the moment.</p>
                      ) : null}
                      {userData.recruiterInterviews?.map((interview) => {
                        return (
                          <InterviewListItem
                            key={interview.id} 
                            interviewToken={interview.hostToken}
                            candidate={interview.candidate}
                            scheduledTime={interview.scheduledTime}
                            interviewId={interview.id}
                          />
                        )
                      }, [])}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="requests" className="space-y-4">
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Pending Interview Requests</CardTitle>
                  <CardDescription>
                    You have {userData.recruiterRequests.length} interview request{userData.recruiterRequests.length == 1 ? "" : "s"} pending.
                  </CardDescription>  
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {userData.recruiterRequests.length === 0 ? (
                      <p>No interview requests at the moment.</p>
                    ) : null}
                    {userData.recruiterRequests?.map((request) => {
                        return (
                          <InterviewRequestListItem
                            key={request.id} 
                            candidate={request.candidate}
                            proposedTime={request.proposedTime}
                            requestId={request.id}
                          />
                        )
                      }, [])}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="interviews" className="space-y-4">
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Upcoming Interviews</CardTitle>
                  <CardDescription>
                    You have {userData.recruiterInterviews.length} interview{userData.recruiterInterviews.length == 1 ? "" : "s"} upcoming.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {userData.recruiterInterviews.length === 0 ? (
                      <p>No upcoming interviews at the moment.</p>
                    ) : null}
                    {userData.recruiterInterviews?.map((interview) => {
                      return (
                        <InterviewListItem
                          key={interview.id} 
                          interviewToken={interview.hostToken}
                          candidate={interview.candidate}
                          scheduledTime={interview.scheduledTime}
                          interviewId={interview.id}
                        />
                      )
                    }, [])}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CandidateDashboard;