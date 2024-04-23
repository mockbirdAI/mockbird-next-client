'use client'

import React, { useState } from 'react';
import { ScrollArea } from "@/common/components/ui/ScrollArea";
import { UserRole } from '@prisma/client';
import prisma from '@/lib/prisma';

async function getRecruiters(school: string) {
  try {
    const recruiters = await prisma.user.findMany({
      where: {
        role: UserRole.RECRUITER,
        profile: {
          school: {
            name: school
          }
        }
      }
    });

    return recruiters || [];
  } catch (err) {
    console.error(err);
  }
}


const Discover = async () => {
  const [school, setSchool] = useState('');

  const handleSchoolChange = (e: any) => {
    setSchool(e.target.value);
  };

  const handleSearch = async () => {
    const recruiters = await getRecruiters(school);
    // Display recruiters or handle the data as needed
    console.log(recruiters); // For demonstration, log to console
  };

  return (
    <div className='h-screen'>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Discover</h2>
            <button onClick={handleSearch}>Search</button>
          </div>
          <div>
            <label>School:
              <select name="school" onChange={handleSchoolChange} value={school}>
                <option value="">Select School</option>
                <option value="University of Washington">University of Washington</option>
                <option value="Washington State University">Washington State University</option>
                <option value="MIT">MIT</option>
              </select>
            </label>
          </div>

          {/* Here you would render the list of recruiters based on the search */}

        </div>
      </ScrollArea>
    </div>
  );
};

export default Discover;
