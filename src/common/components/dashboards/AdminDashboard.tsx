import { authOptions } from '@/lib/auth';
import { PaymentStatus, SupportTicketStatus, UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import React from 'react';
import prisma from '@/lib/prisma';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/common/components/ui/Tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/common/components/ui/Card";
import { ScrollArea } from '../ui/ScrollArea';
import { Button } from '../ui/Button';
import ApprovePendingPaymentButton from '../admin/ApprovePendingPaymentButton';
import CloseTicketButton from '../admin/CloseTicketButton';

const getPendingPayments = async () => {
  const payments = await prisma.payment.findMany({
    where: {
      status: PaymentStatus.PENDING
    },
    select: {
      id: true,
      interview: {
        select: {
          candidate: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          recruiter: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          scheduledTime: true,
          id: true
        }
      },
      amount: true,
      status: true,
      createdAt: true,
      payerId: true,
      payeeId: true,
      paymentIntentId: true
    }
  })

  return payments;
}

const getOpenTickets = async () => {
  const tickets = await prisma.supportTicket.findMany({
    where: {
      status: SupportTicketStatus.OPEN
    },
    include: {
      user: {
        select: {
          role: true
        }
      }
    }
  })

  return tickets;
}

const Admin: React.FC = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== UserRole.ADMIN) {
    return <div>You are not authorized to view this page</div>;
  }

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const pendingPayments = await getPendingPayments();

  const openTickets = await getOpenTickets();

  return (
    <ScrollArea className='bg-gray-100 p-8'>
      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList className="mb-4">
          <TabsTrigger value="payments">Pending Payments</TabsTrigger>
          <TabsTrigger value="applications">Recruiter Applications</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
        </TabsList>
        <TabsContent value="payments" className="space-y-4">
          {pendingPayments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader>
                <div className='flex flex-row justify-between'>
                  <CardTitle>Payment ID: {payment.id}</CardTitle>
                  <ApprovePendingPaymentButton paymentId={payment.id} paymentIntentId={payment.paymentIntentId} />
                </div>
              </CardHeader>
              <CardContent>
                <p>Amount: {currencyFormatter.format(payment.amount / 100)}</p>
                <p>Status: {payment.status}</p>
                <p>Created At: {payment.createdAt.toDateString()}</p>
                <p>Candidate: <a target="_blank" href={`/profile/${payment.payerId}`}>{payment.interview.candidate.firstName} {payment.interview.candidate.lastName}</a></p>
                <p>Recruiter: <a target="_blank" href={`/recruiter/${payment.payeeId}`}>{payment.interview.recruiter.firstName} {payment.interview.recruiter.lastName}</a></p>
                <p>Interview ID: <a target="_blank" href={`https://dev.dyte.io/sessions?orgId=339a07da-864b-4ea1-bdad-0a9b95bfe6f5&search=${payment.interview.id}`}>{payment.interview.id}</a></p>
                <p>Scheduled Time: {payment.interview.scheduledTime.toDateString()}</p>
                <p>Payment Intent Id: <a target="_blank" href={`https://dashboard.stripe.com/payments/${payment.paymentIntentId}`}>{payment.paymentIntentId}</a></p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="applications">
          {/* Render User Applications */}
        </TabsContent>
        <TabsContent value="tickets">
        {openTickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader>
                <div className='flex flex-row justify-between'>
                  <CardTitle>Ticket ID: {ticket.id}</CardTitle>
                  <CloseTicketButton ticketId={ticket.id} />
                </div>
              </CardHeader>
              <CardContent>
                <p>Sender: {ticket.name}</p>
                <p>Ticket Status: {ticket.status}</p>
                <p>Category: {ticket.category}</p>
                <p>Email: {ticket.senderEmail}</p>
                <p>Message: {ticket.message}</p>
                <p>Role: {ticket.user.role}</p>
                <p>User Id: <a target="_blank" href={ticket.user.role === UserRole.RECRUITER ? `/recruiter/${ticket.userId}` : `/profile/${ticket.userId}`}>{ticket.userId}</a></p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
};

export default Admin;
