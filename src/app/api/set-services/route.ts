import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

function sortServices(a: any, b: any) {
  return a.price < b.price
}

export async function POST(request: any) {
  const res = await request.json()
  const { userId, services } = res;

  // Sort the future availability dates
  let sortedServices = services.sort(sortServices);

  // Update the user's availability in the database
  const updateRequest = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      services: sortedServices,
    },
  });

  return NextResponse.json({ updateRequest })
}
