import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const schools = url.searchParams.get('schools')?.split(',') || [];
  const companies = url.searchParams.get('companies')?.split(',') || [];
  const searchTerm = url.searchParams.get('searchTerm') || '';

  const api = await prisma.user.findMany({
    where: {
      role: UserRole.RECRUITER,
      ...((schools.length > 0) && (schools[0] !== '') && {
        profile: {
          UserSchool: {
            some: { school: { name: { in: schools } } },
          },
        },
      }),
      AND: {
        ...((companies.length > 0) && (companies[0] !== '') && {
        profile: {
          UserCompany: {
            some: { company: { name: { in: companies } } },
          },
        },
      })},
      OR: searchTerm ? [
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
        { profile: { UserCompany: { some: { company: { name: { contains: searchTerm, mode: 'insensitive' } } } } } },
        { profile: { UserSchool: { some: { school: { name: { contains: searchTerm, mode: 'insensitive' } } } } } },
      ] : undefined,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profile: {
        select: {
          UserCompany: {
            select: {
              company: true,
              role: true,
            },
          },
          UserSchool: {
            select: {
              school: true,
            },
          },
          profilePicture: true,
          slug: true
        },
      },
    },
  });

  return NextResponse.json({ api });
}
