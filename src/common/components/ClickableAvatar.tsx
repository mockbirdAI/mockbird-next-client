'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@/common/components/ui/Avatar';
import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ClickableAvatarProps {
  imageUrl: string;
  altText: string;
  onClick?: () => void;
}

const ClickableAvatar: React.FC<ClickableAvatarProps> = ({ imageUrl, altText, onClick }) => {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <Avatar 
      className="h-9 w-9 border-2 border-sxpurple cursor-pointer"
      onClick={() => {
        if (session?.user.role === UserRole.RECRUITER) {
          router.push(`/recruiter/${session?.user.id}`)
        } else {
          router.push(`/profile/${session?.user.id}`)
        }

      }
    }>
      <AvatarImage src="/avatars/01.png" alt="Avatar" />
      <AvatarFallback className="text-black">{session?.user.firstName.charAt(0)}{session?.user.lastName.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

export default ClickableAvatar;