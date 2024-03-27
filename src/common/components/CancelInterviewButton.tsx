'use client';

// CancelRequestButton.client.tsx
import React from 'react';
import { Button } from '@/common/components/ui/Button';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';

interface CancelInterviewButtonProps {
  interviewId: number;
}

const cancelInterview = async (interviewId: number) => {
  try {
    const res = await fetch('/api/cancel-interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        interviewId
      })
    });
  } catch (error) {
    console.error(error);
  }
}

const CancelInterviewButton: React.FC<CancelInterviewButtonProps> = ({ interviewId }) => {
  const { toast } = useToast();
  const router = useRouter();
  return (
    <Button onClick={async () => {
      try {
        await cancelInterview(interviewId);
        toast({
          title: 'Interview Cancelled',
          description: 'The interview has been cancelled.',
        })
        router.refresh();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'There was an error cancelling the interview.',
        })
      }
    }} variant="destructive">Cancel Interview</Button>
  );
};

export default CancelInterviewButton;
