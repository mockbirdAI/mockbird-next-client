import React, { useState } from 'react';
import { ScrollArea } from "@/common/components/ui/ScrollArea";
import { PaymentStatus, UserRole } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getBalance() {
  const session = await getServerSession(authOptions);
  const payments = await prisma.payment.findMany({
    where: {
      payeeId: String(session?.user.id),
    },
    select: {
      id: true,
      amount: true,
      status: true,
      createdAt: true,
    }
  })

  return payments;
}

const Balance = async () => {
  const balances = await getBalance();

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const pendingPayments = balances.filter((payment) => {
    return payment.status === PaymentStatus.PENDING
  })

  const completedPayments = balances.filter((payment) => {
    return payment.status === PaymentStatus.COMPLETED
  })

  const totalPending = pendingPayments.reduce((acc, payment) => {
    return acc + payment.amount / 100;
  }, 0);

  const totalCompleted = completedPayments.reduce((acc, payment) => {
    return acc + payment.amount / 100;
  }, 0);

  const formattedWithdrawable = currencyFormatter.format(totalCompleted);
  const formattedPending = currencyFormatter.format(totalPending);

  
  return (
    <div className='h-screen'>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div>
            PayPal Email: 
          </div>
          <div>
            <p>Withdrawable: {formattedWithdrawable}</p>
          </div>
          <div>
            <p>Pending: {formattedPending}</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Balance;
