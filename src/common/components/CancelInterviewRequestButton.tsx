'use client';

// CancelRequestButton.client.tsx
import React from 'react';
import { Button } from '@/common/components/ui/Button';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';

interface CancelInterviewRequestButtonProps {
  requestId: number;
}

const cancelRequest = async (requestId: number) => {
  try {
    const res = await fetch('/api/cancel-interview-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requestId
      })
    });
  } catch (error) {
    console.error(error);
  }
}

const CancelInterviewRequestButton: React.FC<CancelInterviewRequestButtonProps> = ({ requestId }) => {
  const { toast } = useToast();
  const router = useRouter();
  return (
    <Button onClick={async () => {
      try {
        await cancelRequest(requestId);
        toast({
          title: 'Request Cancelled',
          description: 'Your interview request has been cancelled.',
        })
        router.refresh();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'There was an error cancelling your interview request.',
        })
      }
    }} variant="destructive">Cancel Request</Button>
  );
};

export default CancelInterviewRequestButton;
