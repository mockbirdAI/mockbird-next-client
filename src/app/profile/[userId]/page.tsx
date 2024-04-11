import { Button } from '@/common/components/ui/Button';
import { $Enums, UserRole } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/common/components/ui/Avatar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: $Enums.UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: number;
  userId: number;
  linkedinUrl: string | null;
  resumeUrl: string | null;
  bio: string | null;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
}

async function getUser() {
  try {
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session?.user.id },
      include: { profile: { include: { company: true } } }
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user", error);
    return null;
  }
}

const Profile: React.FC<any> = async () => {
  const user = await getUser();
  if (!user || !user.profile) {
    return <div className='h-screen flex justify-center items-center'>404. Profile Not Found</div>
  }

  return (
    <div className="h-screen flex flex-col items-center pt-10 px-6">
      <div className="flex flex-col items-center w-full max-w-4xl">
        <div className="w-32 h-32">
          <Avatar className="h-full w-full border-2 border-gray-300 rounded-full overflow-hidden">
            <AvatarImage className="max-w-full max-h-full object-cover"  src={user.profile.profilePicture || "/avatars/01.png"} alt="Avatar" />
            <AvatarFallback className="text-black">{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <h1 className="text-2xl font-semibold mt-4">{user.firstName} {user.lastName}</h1>
        {/* Assuming you have a way to fetch and display the current role */}
        <p className="text-lg text-gray-600 mt-1">{user.profile.company?.name || 'Current Role'}</p>
        <p className="text-center text-gray-700 mt-2">{user.profile.bio}</p>
        <Link href={String(user.profile.linkedinUrl)} target='_blank' className="text-blue-600 hover:underline mt-2">LinkedIn Profile</Link>
        {/* <Button variant="default" className="mt-4">Connect</Button> */}
      </div>

      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-xl font-semibold">Experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Assuming `user.companies` is an array of company objects associated with the user */}
          {/* {user.companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
