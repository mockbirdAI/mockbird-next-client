import React, { useEffect, useState } from 'react';
import prisma from '@/lib/prisma';
import DiscoverPage from '../../common/components/DiscoverPage';

async function getSchools() {
  try {
    const schools = await prisma.school.findMany({});
    return schools;
  } catch (error) {
    console.error("Failed to fetch schools", error);
    return null;
  }
}

async function getCompanies() {
  try {
    const companies = await prisma.company.findMany({});
    return companies;
  } catch (error) {
    console.error("Failed to fetch companies", error);
    return null;
  }
}


const Discover: React.FC<any> = async () => {
  const schools = await getSchools();
  const companies = await getCompanies();

  return (
    <DiscoverPage schools={schools} companies={companies} />
  );
};

export default Discover;