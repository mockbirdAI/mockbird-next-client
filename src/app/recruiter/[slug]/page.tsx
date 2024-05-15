import { Button } from '@/common/components/ui/Button';
import { $Enums, InterviewRequest, RequestStatus, UserRole, User, Profile } from '@prisma/client';
import React from 'react';
import prisma from '@/lib/prisma';
import BookTimeModal from '@/common/components/BookTimeModal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import CancelInterviewRequestButton from '@/common/components/CancelInterviewRequestButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/Avatar';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendar, FaLinkedin, FaLocationDot } from "react-icons/fa6";
import EditProfileModal from '../components/EditProfileModal';
import EditExperiencesModal from '../components/EditExperiencesModal';

async function getRecruiterUser(slug: string) {
  try {
    const recruiters = await prisma.user.findFirst({
      where: {
        OR: [
          {
            profile: {
              slug: slug 
            },
          },
          {
            id: slug
          }
        ],
        role: UserRole.RECRUITER,
      },
      include: {
        recruiterRequests: {
          where: {
            status: RequestStatus.PENDING
          }
        },
        recruiterInterviews: true,
        profile: {
          include: {
            UserCompany: {
              orderBy: [
                {
                  endDate: 'desc'
                }, 
                {
                  startDate: 'desc'
                }
              ],
              include: {
                company: true
              }
            },
            UserSchool: {
              orderBy: [
                {
                  endDate: 'desc'
                },
                {
                  startDate: 'desc'
                }
              ],
              include: {
                school: true
              }
            },
            receivedReviews: {
              include: {
                reviewerProfile: {
                  include: {
                    user: {
                      select: {
                        firstName: true,
                        lastName: true
                      }
                    }
                  }
                }
              }
            }
          },
        },
      }
    })
  return recruiters;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const recruiterUser = await getRecruiterUser(params.slug);
  return {
    title: `${recruiterUser?.firstName} ${recruiterUser?.lastName}`,
    description: recruiterUser?.profile?.bio,
    image: recruiterUser?.profile?.profilePicture,
    url: `https://mockbird.ai/recruiter/${params.slug}`,
  }
}

const RecruiterPage: React.FC<any> = async ({ params }: { params: { slug: string } }) => {
  const recruiterUser = await getRecruiterUser(params.slug);
  const session = await getServerSession(authOptions);

  const services = [
    {
      service: "Coffee Chat",
      duration: 900,
      price: 0
    },
    {
      service: "Resume Review",
      duration: 900,
      price: 0
    },
    {
      service: "Behavioral Mock Interview",
      duration: 3600,
      price: 2000,
    },
    {
      service: "Technical Mock Interview",
      duration: 3600,
      price: 3000
    }
  ]

  let disableBookTime = false;
  let pendingRequest: InterviewRequest = {
    id: 0,
    candidateId: '0',
    recruiterId: '0',
    proposedTime: new Date(),
    purpose: '',
    status: RequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    paymentId: '',
    stripeSessionId: '',
  };

  if (recruiterUser?.recruiterRequests) {
    recruiterUser?.recruiterRequests.forEach((request) => {
      if (request.candidateId === session?.user.id) {
        disableBookTime = true;
        pendingRequest = request;
      }
    });
  }

  if (!recruiterUser?.profile || !recruiterUser) {
    return <div className='h-screen'>404. Profile Not Found</div>
  }
    
  const formatDate = (date: Date | null | undefined): string => {
    if (!date) {
      return 'Present'; // or any other placeholder you want for non-dates
    }
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', // "short" gives the abbreviated month name
      year: 'numeric' // "numeric" gives the full numeric year
    });
  };

  return (
    <div className="flex flex-col items-center pt-10 px-6" style={{ minHeight: 'h-screen' }}>
      <div className="flex flex-row w-full max-w-4xl rounded-xl p-5" style={{ backgroundColor: '#F6F6F6'  }}>
        <div className='me-10'>
          <div className="w-40 h-40">
            <Avatar className="h-full w-full border-2 border-gray-300 rounded-full overflow-hidden">
              <AvatarImage src={recruiterUser.profile.profilePicture || "/avatars/01.png"} alt={`${recruiterUser.firstName} ${recruiterUser.lastName}`} className="max-w-full max-h-full object-cover" />
              <AvatarFallback className="text-black">{recruiterUser.firstName.charAt(0)}{recruiterUser.lastName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <div className='flex flex-col justify-center'>
          <h1 className="text-3xl font-semibold">{recruiterUser.firstName} {recruiterUser.lastName}</h1>
          <div className='flex flex-row mt-2'>
            <div className='flex flex-col justify-center'>
              <FaLocationDot />
            </div>
            
            <div className='ms-1'>{recruiterUser.profile.currentLocation || "USA"}</div>
            <div className='flex flex-col justify-center ms-3'>
              <Link href={String(recruiterUser.profile.linkedinUrl)} target='_blank' className="text-blue-600 hover:underline">{<FaLinkedin />}</Link>
            </div>
          </div>
          {
            session?.user.role === UserRole.CANDIDATE &&
            <div className='mt-5'>
              <BookTimeModal disabled={disableBookTime} recruiterUser={recruiterUser} recruiterProfile={recruiterUser.profile} services={recruiterUser.services || services} />
            </div>
          }
          
        </div>
        {
          session?.user.id === recruiterUser.id && (
            <div className='flex flex-1 justify-end'>
              <EditProfileModal recruiterUser={recruiterUser} />
            </div>
          )
        }
      </div>

      <div className='flex flex-row w-full max-w-4xl mt-8'>
        <div className='w-1/2 me-4 p-4 border border-gray-300 rounded-lg'>
          <h2 className="text-xl font-semibold mb-4">About {recruiterUser.firstName}</h2>
          <p className='leading-relaxed'>{recruiterUser.profile.bio}</p>
        </div>
        <div className='w-1/2 ms-4 p-4 border border-gray-300 rounded-lg'>
          <h2 className="text-xl font-semibold mb-6">__ years of experience</h2>
        </div>
      </div>

      <div className='flex flex-row w-full max-w-4xl mt-8'>
        <div className='w-1/3 me-10'>
          <div className='mt-8'>
            <div className="mb-6 p-4 border border-gray-300 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Currently offering...</h3>
                {
                  recruiterUser.services.map((service: any) => (
                    <div key={service.id} className="mt-2 border border-gray-300 rounded-lg p-4">
                      <p className="text-gray-600">{service?.service}</p>
                    </div>
                  ))
                }
            </div>
          </div>
        </div>

        <div className='w-2/3'>
          <div className="mt-8 border border-gray-300 rounded-lg p-5">
              <div className='flex flex-row justify-between'>
                <h2 className="text-xl font-semibold">Work History</h2>
                <EditExperiencesModal recruiterUser={recruiterUser} />
              </div>
              
              {recruiterUser.profile.UserCompany.length ? (
                <div className="mt-4">
                  {recruiterUser.profile.UserCompany.map((experience) => (
                    <div key={experience.id} className="mb-6 flex flex-row items-center">
                      <div className='w-[50px] h-[50px] relative mr-4'>
                        {experience.company.logoUrl ? (
                          <Image
                            src={experience.company.logoUrl}
                            alt={`${experience.company.name} logo`}
                            layout="fill"
                            objectFit="contain"
                          />
                        ) : (
                          <Image
                            src="/mockbird_logo.svg" // Replace with your default logo path
                            alt="mockbird"
                            layout="fill"
                            objectFit="contain"
                          />
                        )}
                      </div>
                      <div className='flex-grow'>
                        <h3 className="text-xl font-semibold">{experience.role}</h3>
                        <div className='flex flex-row justify-between'>
                          <p className="font-bold">{experience.company.name}</p>
                          <div className='flex flex-row items-center'>
                            <FaCalendar className="text-gray-500 me-1" />
                            <p className="text-gray-600 text-sm ">{formatDate(experience.startDate)} - {experience.endDate != null ? formatDate(experience.endDate) : "Current"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p>No experiences listed.</p>}
            </div>
          <div className="mt-8 border border-gray-300 rounded-lg p-5">
            <h2 className="text-xl font-semibold">Education</h2>
            <div className='mt-4'>
              {recruiterUser.profile.UserSchool.length ? (
                <div className="mt-4">
                  {recruiterUser.profile.UserSchool.map((school) => (
                    <div key={school.id} className="mb-6 flex flex-row items-center">
                      <div className='w-[50px] h-[50px] relative mr-4'>
                        {school.school.logoUrl ? (
                          <Image
                            src={school.school.logoUrl}
                            alt={`${school.school.name} logo`}
                            layout="fill"
                            objectFit="contain"
                          />
                        ) : (
                          <Image
                            src="/mockbird_logo.svg" // Replace with your default logo path
                            alt="mockbird"
                            layout="fill"
                            objectFit="contain"
                          />
                        )}
                      </div>
                      <div className='flex-grow'>
                        <h3 className="text-xl font-semibold">{school.degree} in {school.major}</h3>
                        <div className='flex flex-row justify-between'>
                          <p className="font-bold">{school.school.name}</p>
                          <div className='flex flex-row items-center'>
                            <FaCalendar className="text-gray-500 me-1" />
                            <p className="text-gray-600 text-sm ">{formatDate(school.startDate)} - {school.endDate != null ? formatDate(school.endDate) : "Current"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p>No experiences listed.</p>}
            </div>
          </div>
          
        </div>
      
      </div>
      
      <div className='flex flex-col w-full max-w-4xl mt-10'>
        <h2 className="text-xl font-semibold">Reviews</h2>
        <div className=''>
          {recruiterUser.profile.receivedReviews.length ? (
              <div className="mt-4">
                {recruiterUser.profile.receivedReviews.map((review) => (
                  <div key={review.id} className="mb-6 p-4 border border-gray-300 rounded-lg">
                    <h3 className="text-lg font-semibold">{review.reviewerProfile.user.firstName} {review.reviewerProfile.user.lastName}</h3>
                    <p className="text-gray-600">{review.reviewText}</p>
                  </div>
                ))}
              </div>
            ) : <p>No reviews listed.</p>}
        </div>
          
      </div>
      
    </div>
  );
};

export default RecruiterPage;