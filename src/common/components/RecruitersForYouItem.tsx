'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/common/components/ui/Avatar";
import { useRouter } from "next/navigation";
import LoadingButton from "./LoadingButton";
import { useState } from "react";

interface RecruitersForYouProps {
  userId: string;
  profilePicture: string | undefined | null;
  firstName: string;
  lastName: string;
  role: string;
  company: string | undefined;
}


export const RecruitersForYou = ({ userId, profilePicture, firstName, lastName, role, company }: RecruitersForYouProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex my-3 mx-2 items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src={String(profilePicture)} alt="Avatar" />
          <AvatarFallback>{firstName.charAt(0)}{lastName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{firstName} {lastName}</p>
          <p className="text-sm text-muted-foreground">
            {company ? company : role}
          </p>
        </div>
        
        <div className="ml-auto font-medium">
          <LoadingButton 
            variant="default"
            loading={loading}
            onClick={() => {
                setLoading(true)
                router.push(`/recruiter/${userId}`)
                setLoading(false);
              }
            }
          >
            View Profile
          </LoadingButton>
        </div>
      </div>
  )
}