'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/common/components/ui/Button';

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from '@/common/components/ui/use-toast';
import prisma from '@/lib/prisma';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/ui/Form"
import { Input } from "@/common/components/ui/Input"
import { PutBlobResult } from '@vercel/blob';
import { getSession, useSession } from 'next-auth/react';
import { TextArea } from '@/common/components/ui/TextArea';
import { useRouter } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/Select"
import LoadingButton from '@/common/components/LoadingButton';
import { UserCompany } from '@prisma/client';

const experienceSchema = z.object({
  roleTitle: z.string().min(1, {
    message: "Role title is required.",
  }),
  companyId: z.string().min(1, {
    message: "Company is required.",
  }),
  startDate: z.string().min(1, {
    message: "Start date is required.",
  }), // You might want to use a date format validation here
  endDate: z.string().min(1).optional(), // Optional if current job
});

const formSchema = z.object({
  linkedinUrl: z.string().min(2, {
    message: "LinkedIn URL must be at least 2 characters.",
  }),
  bio: z.string().min(2, {
    message: "Bio must be at least 2 characters.",
  }),
  role: z.string(),
  experiences: z.array(experienceSchema),
  school: z.string(),
  company: z.string(),
  profilePicture: z.any().optional(),
  resume: z.any().optional(),
})

const Onboarding: React.FC = () => {
  const profilePictureRef = useRef<HTMLInputElement>(null); 
  const resumeRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const [profilePicture, setProfilePicture] = useState<File | undefined>(undefined);
  const [resume, setResume] = useState<File | undefined>(undefined);

  const router = useRouter();

  const [schools, setSchools] = useState<any[] | undefined>(undefined);
  const [companies, setCompanies] = useState<any[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    async function getSchools() {
      const fetchedSchools = await fetch("/api/get-school-data", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const schools = await fetchedSchools.json();
      setSchools(schools.res)
    }

    async function getCompanies() {
      const fetchedCompanies = await fetch("/api/get-company-data", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const companies = await fetchedCompanies.json();
      setCompanies(companies.res)
    }
    
    getSchools();
    getCompanies();
  }, []);
  

  // Handler for profile picture change
  const handleProfilePictureChange = () => {
    if (profilePictureRef.current?.files?.[0]) {
      setProfilePicture(profilePictureRef.current.files[0]);
    } else {
      setProfilePicture(undefined);
    }
  };

  // Handler for resume change
  const handleResumeChange = () => {
    if (resumeRef.current?.files?.[0]) {
      setResume(resumeRef.current.files[0]);
    } else {
      setResume(undefined);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkedinUrl: "",
      bio: "",
      role: "",
      experiences: [],
      school: "",
      company: "",
      profilePicture: undefined,
      resume: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const formData = new FormData();
    formData.append('linkedinUrl', values.linkedinUrl);
    formData.append('role', values.role);
    formData.append('company', values.company);
    formData.append('school', values.school);

    // if (values.role === "recruiter") {
    //   await fetch(
    //     `/api/update-user`,
    //     {
    //       method: 'POST',
    //       body: JSON.stringify({
    //         userId: session?.user.id,
    //         role: UserRole.RECRUITER,
    //       }),
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //     },
    //   );
    // }

    const companyId = companies?.find((company) => company.name === values.company)?.id;
    const schoolId = companies?.find((school) => school.name === values.school)?.id;

    const profilePictureUploadResponse = await fetch(
      `/api/onboarding/blob-upload?filename=pfp-${session?.user.id}${profilePicture?.name.split("."[1])}`,
      {
        method: 'POST',
        body: profilePicture,
      },
    );

    const profilePictureBlob = (await profilePictureUploadResponse.json()) as PutBlobResult;

    const resumeUploadResumeResponse = await fetch(
      `/api/onboarding/blob-upload?filename=resume-${session?.user.id}${resume?.name.split("."[1])}`,
      {
        method: 'POST',
        body: resume,
      },
    );

    const resumeBlob = (await resumeUploadResumeResponse.json()) as PutBlobResult;

    const apiRes = await addProfileData(String(session?.user.id), values.linkedinUrl, resumeBlob.url, values.bio, profilePictureBlob.url, companyId, schoolId, values.experiences);

    if (apiRes?.ok) {
      router.push('/dashboard');
      toast({
        title: "Success",
        description: "Profile data added successfully.",
        variant: 'default'
      });
    } else {
      console.error('Error adding profile data');
      toast({
        title: "Error",
        description: "There was an error adding your profile data. Please try again.",
        variant: 'destructive'
      });
    }
    setLoading(false);
  }
  
  const addProfileData = async (userId: string, linkedinUrl: string, resumeUrl: string, bio: string, profilePicture: string, companyId: number, schoolId: number, experiences: any[]) => {
    try {
      const res = await fetch('/api/add-profile-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          linkedinUrl,
          resumeUrl,
          bio,
          profilePicture,
          schoolId,
          companyId,
          experiences
        })
      });
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  return (
    <div className='flex flex-col items-center my-8'>
      <h1 className='mb-4 text-large'>Tell us about you</h1>
      <div className='w-1/2 h-5/6 p-5 border'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-100 h-full flex flex-col justify-between">
            <div className='flex flex-col'>
              <div className='mb-5 flex flex-row justify-between'>
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>School/University</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a University" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schools?.map((school) => {
                            return (
                              <SelectGroup key={school.id} title={school.name}>
                                <SelectItem value={school.name}>{school.name}</SelectItem>
                              </SelectGroup>
                            )
                          }, [])}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Current Company</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Company" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies?.map((company) => {
                            return (
                              <SelectGroup key={company.id} title={company.name}>
                                <SelectItem value={company.name}>{company.name}</SelectItem>
                              </SelectGroup>
                            )
                          }, [])}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experiences</FormLabel>
                        <FormControl>
                          <div className='flex flex-col w-full'>
                            {fields.map((field, index) => (
                              <div className='flex-col' key={field.id}>
                                <div className='flex flex-row w-full'>
                                  <Input className='me-1' {...form.register(`experiences.${index}.roleTitle`)} placeholder="Role Title" />
                                  <Input className='ms-1' {...form.register(`experiences.${index}.companyId`)} placeholder="Company" />
                                </div>
                                
                                <div className='flex flex-row w-full mt-2'>
                                  <div className='w-full me-1'>
                                    <FormDescription>Start Date</FormDescription>
                                    <Input {...form.register(`experiences.${index}.startDate`)} placeholder="Start Date" type="date" />
                                  </div>
                                  <div className='w-full ms-1'>
                                    <FormDescription>End Date</FormDescription>
                                    <Input {...form.register(`experiences.${index}.endDate`)} placeholder="End Date" type="date" />
                                  </div>
                                </div>

                                <div className='mb-2 flex justify-end'>
                                  <Button variant="destructive" type="button" onClick={() => remove(index)}>x</Button>
                                </div>
                              </div>
                            ))}
                            
                            <Button variant="outline" type="button" onClick={() => append({ roleTitle: "", companyId: "", startDate: "", endDate: "" })}>
                              Add Experience
                            </Button>  
                          </div>                    
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                    
              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.linkedin.com/in/" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be shown on your profile.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <TextArea placeholder="About me..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Tell us a little blurb about yourself.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className='mb-5'>
                <FormField 
                  control={form.control} 
                  name="profilePicture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <label className="block w-full text-center border border-gray-300 rounded py-2 px-4 cursor-pointer hover:bg-gray-50">
                          {profilePicture ? profilePicture.name : "Click to upload"}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            ref={profilePictureRef}
                            onChange={handleProfilePictureChange}
                          />
                        </label>
                      </FormControl>
                      <FormDescription>
                        Upload your profile picture.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='mb-5'>
                <FormField 
                  control={form.control} 
                  name="resume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resume</FormLabel>
                      <FormControl>
                        <label className="block w-full text-center border border-gray-300 rounded py-2 px-4 cursor-pointer hover:bg-gray-50">
                          {resume ? resume.name : "Click to upload"}
                          <input
                            type="file"
                            className="hidden"
                            accept=".doc,.docx,.pdf"
                            ref={resumeRef}
                            onChange={handleResumeChange}
                          />
                        </label>
                      </FormControl>
                      <FormDescription>
                        Upload your resume.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
            </div>
            
            <LoadingButton loading={loading} type="submit">Submit</LoadingButton>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Onboarding;
