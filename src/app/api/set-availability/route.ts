import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

function sortDates(a: Date, b: Date) {
  const dateA = a ? new Date(a).getTime() : null;
  const dateB = b ? new Date(b).getTime() : null;

  if (dateA && dateB) {
    return dateA - dateB; // Sorts from least to greatest
  }

  if (!dateA && !dateB) {
    const startA = new Date(a).getTime();
    const startB = new Date(b).getTime();
    return startA - startB; 
  }

  if (!dateA) {
    return 1;
  }
  if (!dateB) {
    return -1;
  }
}

export async function POST(request: any) {
  const res = await request.json()
  const { userId, availability } = res;

  // Filter out past dates compared to the current time
  const currentTime = new Date().getTime();
  const futureAvailability = availability.filter((date: string | number | Date) => new Date(date).getTime() > currentTime);

  // Sort the future availability dates
  const sortedAvailability = futureAvailability.sort(sortDates);

  // Update the user's availability in the database
  const updateRequest = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      availability: sortedAvailability,
    },
  });

  return NextResponse.json({ updateRequest })
}
