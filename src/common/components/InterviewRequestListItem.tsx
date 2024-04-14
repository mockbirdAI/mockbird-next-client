'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/common/components/ui/Avatar";
import { Button } from "./ui/Button";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import CancelInterviewRequestButton from "./CancelInterviewRequestButton";

const acceptInterview = async (candidateId: string, recruiterId: string, proposedTime: Date, requestId: number) => {
  try {
    const res = await fetch('/api/accept-interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        candidateId,
        recruiterId,
        proposedTime,
        requestId
      })
    });
  } catch (error) {
    console.error(error);
  }
}

const declineInterview = async (requestId: number) => {
  try {
    const res = await fetch('/api/decline-interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requestId
      })
    });
  } catch (error) {
    console.error(error);
  }
}

export const InterviewRequestListItem = ({ otherUser, proposedTime, requestId }: any) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const candidateId = session?.user?.role === 'CANDIDATE' ? session.user.id : otherUser.id;
  const recruiterId = session?.user?.role === 'RECRUITER' ? session.user.id : otherUser.id;
  
  return (
    <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>{otherUser.firstName.charAt(0)}{otherUser.lastName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{otherUser.firstName} {otherUser.lastName}</p>
          <p className="text-sm text-muted-foreground">
            {otherUser.email}
          </p>
          <p className="text-sm text-muted-foreground">
            {proposedTime.toDateString()} @ {proposedTime.toTimeString()}
          </p>
        </div>
        
        <div className="ml-auto font-medium">
          <div className='d-flex flex-col mt-3'>
            {session?.user.role == UserRole.RECRUITER ? (
              <div>
                <Button 
                  variant="default"
                  onClick={async () => {
                    await acceptInterview(candidateId, recruiterId, proposedTime, requestId);
                    toast({
                      title: 'Interview Request Accepted',
                      description: 'You have accepted the interview request!',
                    });
                    router.refresh();
                  }}
                >
                  Accept
                </Button>
                <Button 
                  variant="destructive"
                  className='ms-2'
                  onClick={async () => {
                    await declineInterview(requestId);
                    toast({
                      title: 'Interview Request Declined',
                      description: 'You have declined the interview request!',
                    });
                    router.refresh();
                  }}
                >
                  Decline
                </Button>
              </div>
            ) : (
              <CancelInterviewRequestButton requestId={requestId} />
            )}
          </div>
        </div>
      </div>
  )
}