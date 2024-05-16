'use client';

// CancelRequestButton.client.tsx
import React from 'react';
import { Button } from '@/common/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useToast } from '../ui/use-toast';
import LoadingButton from '../LoadingButton';

const approvePayment = async (paymentId: number, paymentIntentId: string) => {
  try {
    const res = await fetch('/api/admin/approve-pending-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId,
        paymentIntentId
      })
    })
    return res;
  } catch (error) {
    console.error(error);
    throw error
  }
}

const ApprovePendingPaymentButton: React.FC<any> = ({ paymentId, paymentIntentId }) => {
  const { toast } = useToast();
  const router = useRouter();
  return (
    <LoadingButton 
      onClick={async () => {
        const res = await approvePayment(paymentId, paymentIntentId);
        if (res.ok) {
          toast({
            title: 'Success',
            description: `Payment ${paymentId} has been approved `,
          })
          router.refresh();
        } else {
          toast({
            title: 'Error',
            description: 'There was an error approving this payment',
          })
        }
      }} 
      variant="outline"
    >
      Approve Payment
    </LoadingButton>
  );
};

export default ApprovePendingPaymentButton;
