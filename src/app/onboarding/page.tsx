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

import LoadingButton from '@/common/components/LoadingButton';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/common/components/ui/Popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/common/components/ui/Command"
import { ChevronsUpDown, Check } from 'lucide-react';

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
  endDate: z.string().optional(), // Optional if current job
});

const schoolSchema = z.object({
  degree: z.string().min(1, {
    message: "Degree is required.",
  }),
  major: z.string().min(1, {
    message: "Major is required.",
  }),
  schoolId: z.string().min(1, {
    message: "Company is required.",
  }),
  startDate: z.string().min(1, {
    message: "Start date is required.",
  }), // You might want to use a date format validation here
  endDate: z.string().optional(), // Optional if current job
});

const formSchema = z.object({
  linkedinUrl: z.string().min(2, {
    message: "LinkedIn URL must be at least 2 characters.",
  }),
  bio: z.string().min(2, {
    message: "Bio must be at least 2 characters.",
  }),
  role: z.string(),
  experiences: z.array(experienceSchema).optional(),
  userSchools: z.array(schoolSchema).optional(),
  company: z.string(),
  currentLocation: z.string().optional(),
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
      userSchools: [],
      currentLocation: "",
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
    formData.append('company', String(values.currentLocation));

    const companyId = companies?.find((company) => company.name === values.company)?.id;
    const schoolId = schools?.find((school) => school.name === values.userSchools)?.id;

    const experiencesFormatted = values.experiences ? values.experiences?.map((experience) => {
      return {
        roleTitle: experience.roleTitle,
        companyId: companies?.find((company) => company.name === experience.companyId)?.id,
        startDate: experience.startDate,
        endDate: experience.endDate ? experience.endDate : null,
      };
    }) : [];

    const schoolsFormatted = values.userSchools ? values.userSchools?.map((school) => {
      return {
        degree: school.degree,
        major: school.major,
        schoolId: schools?.find((entr) => entr.name === school.schoolId)?.id,
        startDate: school.startDate,
        endDate: school.endDate ? school.endDate : null,
      };
    }) : [];


    let profilePictureBlobUrl = "";

    if (profilePicture) {
      const profilePictureUploadResponse = await fetch(
        `/api/onboarding/upload-profile-picture?filename=${session?.user.id}.${profilePicture?.name.split(".")[1]}`,
        {
          method: 'POST',
          body: profilePicture,
        },
      );
      profilePictureBlobUrl = ((await profilePictureUploadResponse.json()) as PutBlobResult).url;
    }

    

    let resumeBlobUrl = "";
    if (resume) {
      const resumeUploadResumeResponse = await fetch(
        `/api/onboarding/upload-resume?filename=${session?.user.id}.${resume?.name.split(".")[1]}`,
        {
          method: 'POST',
          body: resume,
        },
      );
      resumeBlobUrl = ((await resumeUploadResumeResponse.json()) as PutBlobResult).url;
    }

    const apiRes = await addProfileData(String(session?.user.id), values.linkedinUrl, resumeBlobUrl, values.bio, profilePictureBlobUrl, companyId, schoolsFormatted, experiencesFormatted, String(values.currentLocation));

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
  
  const addProfileData = async (userId: string, linkedinUrl: string, resumeUrl: string, bio: string, profilePicture: string, companyId: number, schools: any[], experiences: any[], currentLocation: string) => {
    console.log(schools);
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
          schools,
          currentLocation,
          companyId,
          experiences,
        })
      });
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  const { fields: userSchoolsFields, append: appendUserSchool, remove: removeUserSchool } = useFieldArray({
    control: form.control,
    name: "userSchools",
  });

  const { fields: experiencesFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  useEffect(() => {
    console.log(form.getValues());
  })

  return (
    <div className='flex flex-col items-center my-8'>
      <h1 className='mb-4 text-large'>Tell us about you</h1>
      <div className='w-1/2 h-5/6 p-5 border'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-100 h-full flex flex-col justify-between">
            <div className='flex flex-col'>
              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="userSchools"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School/University</FormLabel>
                        <FormControl>
                          <div className='flex flex-col w-full'>
                            {userSchoolsFields.map((field, index) => (
                              <div className='flex-col' key={field.id}>
                                <div className='flex flex-row w-full'>
                                  {/* <Input className='ms-1' {...form.register(`experiences.${index}.companyId`)} placeholder="Company" /> */}
                                  <FormField
                                    control={form.control}
                                    name={`userSchools.${index}.schoolId`}
                                    render={({ field }) => (
                                      <FormItem className="flex flex-col w-full">
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <FormControl>
                                              <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                  "w-full justify-between",
                                                  !field.value && "text-muted-foreground"
                                                )}
                                              >
                                                {field.value
                                                  ? schools?.find(
                                                      (school) => school.name === field.value
                                                    )?.name
                                                  : "Select School"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                              </Button>
                                            </FormControl>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-full p-0">
                                            <Command>
                                              <CommandInput placeholder="Search school..." />
                                              <CommandEmpty>No schools found.</CommandEmpty>
                                              <CommandGroup>
                                                <CommandList>
                                                  {schools?.map((school) => (
                                                    <CommandItem
                                                      value={school.name}
                                                      key={school.id}
                                                      onSelect={() => {
                                                        form.setValue(`userSchools.${index}.schoolId`, school.name);
                                                      }}
                                                    >
                                                      <Check
                                                        className={cn(
                                                          "mr-2 h-4 w-4",
                                                          school.name === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                        )}
                                                      />
                                                      {school.name}
                                                    </CommandItem>
                                                  ))}
                                                </CommandList>
                                              </CommandGroup>
                                            </Command>
                                          </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                </div>

                                <div className='flex flex-row w-full mt-2'>
                                  <div className='w-full me-1'>
                                    <FormDescription>Degree</FormDescription>
                                    <Input className='me-1' {...form.register(`userSchools.${index}.degree`)} placeholder="Bachelor's" />
                                  </div>
                                  <div className='w-full ms-1'>
                                    <FormDescription>Major</FormDescription>
                                    <Input className='me-1' {...form.register(`userSchools.${index}.major`)} placeholder="Concentration" />
                                  </div>
                                </div>
                                
                                <div className='flex flex-row w-full mt-2'>
                                  <div className='w-full me-1'>
                                    <FormDescription>Start Date</FormDescription>
                                    <Input {...form.register(`userSchools.${index}.startDate`)} placeholder="Start Date" type="date" />
                                  </div>
                                  <div className='w-full ms-1'>
                                    <FormDescription>End Date</FormDescription>
                                    <Input {...form.register(`userSchools.${index}.endDate`)} placeholder="End Date" type="date" />
                                  </div>
                                </div>

                                <div className='mb-2 flex justify-end'>
                                  <Button variant="destructive" type="button" onClick={() => removeUserSchool(index)}>x</Button>
                                </div>
                              </div>
                            ))}
                            
                            <Button variant="outline" type="button" onClick={() => appendUserSchool({ major: "", degree: "", schoolId: "", startDate: "", endDate: "" })}>
                              Add School
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experiences</FormLabel>
                        <FormControl>
                          <div className='flex flex-col w-full'>
                            {experiencesFields.map((field, index) => (
                              <div className='flex-col' key={field.id}>
                                <div className='flex flex-row w-full'>
                                  <Input className='me-1' {...form.register(`experiences.${index}.roleTitle`)} placeholder="Role Title" />
                                  {/* <Input className='ms-1' {...form.register(`experiences.${index}.companyId`)} placeholder="Company" /> */}
                                  <FormField
                                    control={form.control}
                                    name={`experiences.${index}.companyId`}
                                    render={({ field }) => (
                                      <FormItem className="flex flex-col w-full">
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <FormControl>
                                              <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                  "w-full justify-between",
                                                  !field.value && "text-muted-foreground"
                                                )}
                                              >
                                                {field.value
                                                  ? companies?.find(
                                                      (company) => company.name === field.value
                                                    )?.name
                                                  : "Select company"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                              </Button>
                                            </FormControl>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-full p-0">
                                            <Command>
                                              <CommandInput placeholder="Search companies..." />
                                              <CommandEmpty>No companies found.</CommandEmpty>
                                              <CommandGroup>
                                                <CommandList>
                                                  {companies?.map((company) => (
                                                    <CommandItem
                                                      value={company.name}
                                                      key={company.id}
                                                      onSelect={() => {
                                                        form.setValue(`experiences.${index}.companyId`, company.name);
                                                      }}
                                                    >
                                                      <Check
                                                        className={cn(
                                                          "mr-2 h-4 w-4",
                                                          company.name === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                        )}
                                                      />
                                                      {company.name}
                                                    </CommandItem>
                                                  ))}
                                                </CommandList>
                                              </CommandGroup>
                                            </Command>
                                          </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

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
                                  <Button variant="destructive" type="button" onClick={() => removeExperience(index)}>x</Button>
                                </div>
                              </div>
                            ))}
                            
                            <Button variant="outline" type="button" onClick={() => appendExperience({ roleTitle: "", companyId: "", startDate: "", endDate: "" })}>
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
                  name="currentLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Location</FormLabel>
                      <FormControl className="flex items-center">
                        <div>
                          <Input
                            {...field}
                            placeholder="ex. Seattle, WA, USA"
                            style={{ flex: 1 }}
                            className="flex-1"
                          />
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
                      <FormControl className="flex items-center">
                        <div>
                          <Input
                            {...field}
                            placeholder="https://www.linkedin.com/in/"
                            style={{ flex: 1 }}
                            className="flex-1"
                          />
                        </div>
                        
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
