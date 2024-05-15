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
  const { experiences } = res;

  const userId = session.user.id; // Assume you have a way to get userId from session

  try {
    // Fetch current experiences entries from the database
    const currentExperiences = await prisma.userCompany.findMany({
        where: { userId: userId }
    });

    // Determine which IDs are currently stored
    const currentIds = currentExperiences.map(entry => entry.id);

    // Determine which IDs were sent by the client
    const sentIds = experiences.filter((e: { id: any; }) => e.id).map((e: { id: any; }) => e.id);

    // IDs to delete are those that are in currentIds but not in sentIds
    const idsToDelete = currentIds.filter(id => !sentIds.includes(id));

    // Operations to perform in the transaction
    const operations = [];

    // Update and create operations
    for (const exp of experiences) {
        if (exp.id) {
            operations.push(prisma.userCompany.update({
                where: { id: exp.id },
                data: {
                    role: exp.role,
                    companyId: Number(exp.companyId),
                    startDate: new Date(exp.startDate),
                    endDate: exp.endDate ? new Date(exp.endDate) : null
                }
            }));
        } else {
            operations.push(prisma.userCompany.create({
                data: {
                    userId: userId,
                    role: exp.role,
                    companyId: Number(exp.companyId),
                    startDate: new Date(exp.startDate),
                    endDate: exp.endDate ? new Date(exp.endDate) : null
                }
            }));
        }
    }

    // Delete operations
    idsToDelete.forEach(id => {
        operations.push(prisma.userCompany.delete({
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