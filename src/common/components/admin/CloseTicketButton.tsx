'use client';

// CancelRequestButton.client.tsx
import React from 'react';
import { Button } from '@/common/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useToast } from '../ui/use-toast';
import LoadingButton from '../LoadingButton';

const closeTicket = async (ticketId: number) => {
  try {
    const res = await fetch('/api/admin/close-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticketId
      })
    })
    return res;
  } catch (error) {
    console.error(error);
    throw error
  }
}

const CloseTicketButton: React.FC<any> = ({ ticketId }) => {
  const { toast } = useToast();
  const router = useRouter();
  return (
    <LoadingButton 
      onClick={async () => {
        const res = await closeTicket(ticketId);
        if (res.ok) {
          toast({
            title: 'Success',
            description: `Ticket ${ticketId} has been closed `,
          })
          router.refresh();
        } else {
          toast({
            title: 'Error',
            description: 'There was an error closing this ticket',
          })
        }
      }} 
      variant="outline"
    >
      Close Ticket
    </LoadingButton>
  );
};

export default CloseTicketButton;
