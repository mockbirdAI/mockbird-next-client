import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"

export async function POST(request: any) {
  const res = await request.json()
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Invalid session' })
  }
  const { education } = res;

  const userId = session?.user.id;

  try {
    // Fetch current education entries from the database
    const currentEducation = await prisma.userSchool.findMany({
      where: { userId: userId }
    });

    // Determine which IDs are currently stored
    const currentIds = currentEducation.map(entry => entry.id);

    // Determine which IDs were sent by the client
    const sentIds = education.filter((e: { id: any; }) => e.id).map((e: { id: any; }) => e.id);

    // IDs to delete are those that are in currentIds but not in sentIds
    const idsToDelete = currentIds.filter(id => !sentIds.includes(id));

    // Operations to perform in the transaction
    const operations = [];

    // Update and create operations
    for (const educ of education) {
      if (educ.id) {
        operations.push(prisma.userSchool.update({
          where: { id: educ.id },
          data: {
            major: educ.major,
            degree: educ.degree,
            schoolId: Number(educ.schoolId),
            startDate: new Date(educ.startDate),
            endDate: educ.endDate ? new Date(educ.endDate) : null
          }
        }));
      } else {
        operations.push(prisma.userSchool.create({
          data: {
            userId: userId,
            major: educ.major,
            degree: educ.degree,
            schoolId: Number(educ.schoolId),
            startDate: new Date(educ.startDate),
            endDate: educ.endDate ? new Date(educ.endDate) : null
          }
        }));
      }
    }

    // Delete operations
    idsToDelete.forEach(id => {
      operations.push(prisma.userSchool.delete({
        where: { id: id }
      }));
    });

    // Execute all operations as a transaction
    const result = await prisma.$transaction(operations);
    return NextResponse.json({ result })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error })
  }
}