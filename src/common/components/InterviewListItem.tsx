'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/common/components/ui/Avatar";
import { Button } from "./ui/Button";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import CancelInterviewButton from "./CancelInterviewButton";

interface InterviewCardProps {
  candidate: User;
  interviewToken: string | null;
  scheduledTime: Date;
  interviewId: number;
}

export const InterviewListItem = ({ interviewToken, candidate, scheduledTime, interviewId }: InterviewCardProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  return (
    <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>{candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{candidate.firstName} {candidate.lastName}</p>
          <p className="text-sm text-muted-foreground">
            {candidate.email}
          </p>
          <p className="text-sm text-muted-foreground">
            {scheduledTime.toDateString()} @ {scheduledTime.toTimeString()}
          </p>
        </div>
        
        <div className="ml-auto font-medium">
          <div className='flex'>
            <div className="mx-1">
              <CancelInterviewButton interviewId={interviewId} />
            </div>
            <div className="mx-1">
              <Button onClick={() => router.push(`/meeting/${interviewToken}`)}>Join Meeting</Button>
            </div>
          </div>
        </div>
      </div>
  )
}