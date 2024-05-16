import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PaymentStatus, SupportTicketStatus, UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"

export async function POST(request: any) {
  const res = await request.json()
  const { ticketId } = res;

  const session = await getServerSession(authOptions);

  if (session?.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Permission Mismatch" })
  } 

  try {
    const closeTicket = await prisma.supportTicket.update({
      where: {
        id: ticketId,
        status: SupportTicketStatus.OPEN
      },
      data: {
        status: SupportTicketStatus.CLOSED
      }
    })
    return NextResponse.json({ closeTicket })
  } catch (error) {
    console.error(error);
    throw error

  }

}