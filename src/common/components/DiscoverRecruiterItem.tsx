'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/common/components/ui/Avatar";
import { useRouter } from "next/navigation";
import LoadingButton from "./LoadingButton";
import { useState } from "react";

interface DiscoverRecruiterItemProps {
  userId: string;
  profilePicture: string | undefined | null;
  firstName: string;
  lastName: string;
  role: string;
  companies: Array<{ name: string, logoUrl: string | undefined | null }>;
  schools: Array<{ name: string, logoUrl: string | undefined | null }>;
}

export const DiscoverRecruiterItem = ({ userId, profilePicture, firstName, lastName, role, companies, schools }: DiscoverRecruiterItemProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col p-4 border rounded-lg shadow-md bg-white">
      <div className="flex items-center mb-4">
        <Avatar className="h-12 w-12">
          <AvatarImage 
            src={String(profilePicture)} 
            alt={`${firstName} ${lastName}'s profile picture`} 
            className="object-cover"
          />
          <AvatarFallback>{firstName.charAt(0)}{lastName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <p className="text-lg font-semibold">{firstName} {lastName}</p>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700">Companies:</p>
        <div className="flex flex-wrap mt-2">
          {companies.map(company => (
            <div key={company.name} className="flex items-center mr-4 mb-2">
              {company.logoUrl && <img src={company.logoUrl} alt={`${company.name} logo`} className="h-6 w-6 mr-2 object-cover" />}
              <span className="text-sm text-gray-600">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700">Schools:</p>
        <div className="flex flex-wrap mt-2">
          {schools.map(school => (
            <div key={school.name} className="flex items-center mr-4 mb-2">
              {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} logo`} className="h-6 w-6 mr-2 object-cover" />}
              <span className="text-sm text-gray-600">{school.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto">
        <LoadingButton 
          variant="default"
          loading={loading}
          onClick={() => {
              setLoading(true);
              router.push(`/recruiter/${userId}`);
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
