'use client';

// CancelRequestButton.client.tsx
import React, { useState } from 'react';
import { Button } from '@/common/components/ui/Button';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import LoadingButton from './LoadingButton';

interface CancelInterviewButtonProps {
  interviewId: string;
}

const cancelInterview = async (interviewId: string) => {
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
  const [loading, setLoading] = useState(false);
  return (
    <LoadingButton onClick={async () => {
        setLoading(true);
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
        setLoading(false);
      }} 
      variant="destructive"
      loading={loading}
    >
      Cancel
    </LoadingButton>
  );
};

export default CancelInterviewButton;
