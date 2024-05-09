'use client'

import React, { useState } from 'react';
import { ScrollArea } from "@/common/components/ui/ScrollArea";
import LoadingSpinner from '@/common/components/LoadingSpinner';
import { Button } from '@/common/components/ui/Button';
import { DiscoverRecruiterItem } from '@/common/components/DiscoverRecruiterItem';
import Select from 'react-select';
import { Input } from '@/common/components/ui/Input';

const Discover = ({ schools, companies }: any) => {
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<any[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSchoolChange = (selectedOptions: any) => {
    setSelectedSchools(selectedOptions);
  };

  const handleCompanyChange = (selectedOptions: any) => {
    setSelectedCompanies(selectedOptions);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const schools = selectedSchools.map(s => s.value).join(',');
      const companies = selectedCompanies.map(c => c.value).join(',');
      const response = await fetch(`/api/discover-recruiters?schools=${schools}&companies=${companies}&searchTerm=${searchTerm}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const items = await response.json();
      setRecruiters(items.api);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
    setLoading(false);
  };

  const schoolOptions = schools.map((school: any) => {
    return { value: school.name, label: school.name }
  })

  const companyOptions = companies.map((company: any) => {
    return { value: company.name, label: company.name }
  })

  return (
    <div className='h-screen flex flex-col items-center'>
      <ScrollArea className="flex flex-col items-center w-full max-w-5xl">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold tracking-tight">Discover</h2>
            <Button 
              onClick={handleSearch} 
              disabled={loading}
              aria-label="Search for recruiters"
              className={`px-4 py-2 ${loading ? 'bg-gray-300' : 'bg-blue-500'} text-white rounded-md`}
            >
              {loading ? <LoadingSpinner /> : 'Search'}
            </Button>
          </div>
          <div className="w-full space-y-4">
            <div>
              <label htmlFor="schools" className="block text-sm font-medium text-gray-700">Schools:</label>
              <Select
                id="schools"
                isMulti
                options={schoolOptions}
                onChange={handleSchoolChange}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="companies" className="block text-sm font-medium text-gray-700">Companies:</label>
              <Select
                id="companies"
                isMulti
                options={companyOptions}
                onChange={handleCompanyChange}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">Search Term:</label>
              <Input
                id="searchTerm"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
          <div className="mt-4">
            {loading ? (
              <LoadingSpinner /> // Display loading spinner while fetching data
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recruiters?.map((recruiter) => (
                  <DiscoverRecruiterItem 
                    key={recruiter.id}
                    userId={recruiter.id}
                    profilePicture={recruiter.profile?.profilePicture}
                    firstName={recruiter.firstName} 
                    lastName={recruiter.lastName} 
                    role={recruiter.profile?.UserCompany[0]?.role} 
                    companies={recruiter.profile?.UserCompany.map((uc: { company: any; }) => uc.company)} 
                    schools={recruiter.profile?.UserSchool.map((us: { school: any; }) => us.school)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Discover;
