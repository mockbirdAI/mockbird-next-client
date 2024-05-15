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

  const result = await prisma.$transaction(
    experiences.map((exp: { id: any; role: any; companyId: any; startDate: string | number | Date; endDate: string | number | Date; }) => {
      if (exp.id) {
        // Update existing experience
        return prisma.userCompany.update({
          where: { id: exp.id },
          data: {
            role: exp.role,
            companyId: Number(exp.companyId),
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null
          }
        });
      } else {
        // Create new experience
        return prisma.userCompany.create({
          data: {
            userId: session?.user.id,
            role: exp.role,
            companyId: Number(exp.companyId),
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null
          }
        });
      }
    })
  );

  return NextResponse.json({ result })
}