'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/common/components/ui/Avatar";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";

interface RecruitersForYouProps {
  userId: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
  role: string;
}


export const RecruitersForYou = ({ userId, profilePicture, firstName, lastName, role }: RecruitersForYouProps) => {
  const router = useRouter();
  return (
    <div className="flex my-3 mx-2 items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>{firstName.charAt(0)}{lastName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{firstName} {lastName}</p>
          <p className="text-sm text-muted-foreground">
            {role}
          </p>
        </div>
        
        <div className="ml-auto font-medium">
          <Button 
            variant="default"
            onClick={() => router.push(`/recruiter/${userId}`)}
          >
            View Profile
          </Button>
        </div>
      </div>
  )
}