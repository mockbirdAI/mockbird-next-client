import { Button } from '@/common/components/ui/Button';
import { $Enums, UserRole } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/common/components/ui/Avatar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getUser(userId: string) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { 
        profile: { 
          include: { 
            UserCompany: { 
              include: { 
                company: {
                  select: { name: true }
                } 
              },
            },
            school: true
          } 
        } 
      }
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user", error);
    return null;
  }
}

const Profile = async ({ params }: { params: { userId: string } }) => {
  const user = await getUser(params.userId);
  if (!user || !user.profile) {
    return <div className='h-screen flex justify-center items-center'>404. Profile Not Found</div>
  }

  const formatDate = (date: Date) => date ? new Date(date).toLocaleDateString() : 'Present';

  return (
    <div className="h-screen flex flex-col items-center pt-10 px-6">
      <div className="flex flex-col items-center w-full max-w-4xl">
        <div className="w-32 h-32">
          <Avatar className="h-full w-full border-2 border-gray-300 rounded-full overflow-hidden">
            <AvatarImage src={user.profile.profilePicture || "/avatars/01.png"} alt={`${user.firstName} ${user.lastName}`} className="max-w-full max-h-full object-cover" />
            <AvatarFallback className="text-black">{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <h1 className="text-2xl font-semibold mt-4">{user.firstName} {user.lastName}</h1>
        <p className="text-lg text-gray-600 mt-1">{user.profile.UserCompany.length > 0 ? `${user.profile.UserCompany[0].role} @ ${user.profile.UserCompany[0].company.name}` : 'No Current Role'}</p>
        <p className="text-center text-gray-700 mt-2">{user.profile.bio}</p>
        <Link href={String(user.profile.linkedinUrl)} target='_blank' className="text-blue-600 hover:underline mt-2">LinkedIn Profile</Link>
      </div>

      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-xl font-semibold">Education</h2>
        {user.profile.schoolId ? (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{user.profile.school?.name}</h3>
          </div>
        ) : <p>No education listed.</p>}
      </div>

      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-xl font-semibold">Experience</h2>
        {user.profile.UserCompany.length ? (
          <div className="mt-4">
            {user.profile.UserCompany.map((experience) => (
              <div key={experience.id} className="mb-6 p-4 border border-gray-300 rounded-lg">
                <h3 className="text-lg font-semibold">{experience.role} at {experience.company.name}</h3>
                <p className="text-gray-600">{formatDate(experience.startDate)} - {experience.endDate != null ? formatDate(experience.endDate) : "Current"}</p>
              </div>
            ))}
          </div>
        ) : <p>No experiences listed.</p>}
      </div>
    </div>
  );
};

export default Profile;