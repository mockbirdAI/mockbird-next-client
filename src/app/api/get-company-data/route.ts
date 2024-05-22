import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const res = await prisma.company.findMany({
    orderBy: {
      name: 'asc'
    }
  });
  return NextResponse.json({ res })
}