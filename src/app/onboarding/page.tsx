'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/common/components/ui/Button';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from '@/common/components/ui/use-toast';

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
import { useSession } from 'next-auth/react';
import { TextArea } from '@/common/components/ui/TextArea';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  linkedinUrl: z.string().min(2, {
    message: "LinkedIn URL must be at least 2 characters.",
  }),
  bio: z.string().min(2, {
    message: "Bio must be at least 2 characters.",
  }),
  profilePicture: z.any(),
  resume: z.any(),
})

const Onboarding: React.FC = () => {
  const profilePictureRef = useRef<HTMLInputElement>(null); 
  const resumeRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const [profilePicture, setProfilePicture] = useState<File | undefined>(undefined);
  const [resume, setResume] = useState<File | undefined>(undefined);

  const router = useRouter();

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
      profilePicture: undefined,
      resume: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append('linkedinUrl', values.linkedinUrl);

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


    const apiRes = await addProfileData(String(session?.user.id), values.linkedinUrl, resumeBlob.url, values.bio, profilePictureBlob.url);

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
  }
  
  const addProfileData = async (userId: string, linkedinUrl: string, resumeUrl: string, bio: string, profilePicture: string) => {
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
        })
      });
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='h-screen flex flex-col items-center my-8'>
      <h1 className='mb-4 text-large'>Tell us about you</h1>
      <div className='w-1/2 h-5/6 p-5 border'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-100 h-full flex flex-col justify-between">
            <div className='flex flex-col'>
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
                        <TextArea placeholder="Hi, I love cats..." {...field} />
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
                            required
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
                            required
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
            
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Onboarding;
