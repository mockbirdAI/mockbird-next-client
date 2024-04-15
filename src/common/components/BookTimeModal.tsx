'use client';

import { RecruiterProfile, RecruiterUser } from "@/app/recruiter/[recruiterId]/page";
import { Button } from "@/common/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/Dialog"
import { Input } from "@/common/components/ui/Input"
import { Label } from "@/common/components/ui/Label"
import { TextArea } from "@/common/components/ui/TextArea";
import prisma from "@/lib/prisma";
import { useSession } from "next-auth/react";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SelectTimeSlots } from "./SelectTimeSlot";
import { loadStripe } from '@stripe/stripe-js';

interface BookTimeModalProps {
  disabled?: boolean;
  recruiterUser: RecruiterUser;
  recruiterProfile: RecruiterProfile;
}

const stripePromise = loadStripe(
  String(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
);

// Inside your modal component or wherever the booking happens
const handleBooking = async (candidateId: string, recruiterId: string, proposedTime: Date | null, purpose: string, price: number, recruiterName: string) => {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price: Number(price),
      candidateId: candidateId,
      recruiterId: recruiterId,
      proposedTime: proposedTime,
      purpose: purpose,
      recruiterName: recruiterName,
    }),
  });

  const { sessionId } = await response.json();

  if (response.ok && sessionId) {
    const stripe = await stripePromise;
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId });
    }
  } else {
    // Handle error here, e.g., show a message to the user
    console.error('Failed to create Stripe session:', response.statusText);
    console.error("Session ID: ", sessionId)
  }
};


const createInterviewRequest = async (candidateId: string, recruiterId: string, proposedTime: Date | null, purpose: string) => {
  try {
    const res = await fetch('/api/create-interview-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        candidateId,
        recruiterId,
        purpose,
        proposedTime
      })
    });
  } catch (error) {
    console.error(error);
  }
}

export function BookTimeModal({ disabled, recruiterUser, recruiterProfile }: BookTimeModalProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);
  const [purpose, setPurpose] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} variant="outline">{disabled ? "Pending..." : "Book Time"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book an Interview with {recruiterUser.firstName} {recruiterUser.lastName}</DialogTitle>
          <DialogDescription>
            Send a request to meet with {recruiterUser.firstName} here. Your interview request will be pending until they accept.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              When
            </Label>
            <div className="col-span-3">
              <SelectTimeSlots onChange={(e: Date) => setSelectedTimeSlot(e)} timeslots={[new Date()]} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="purpose" className="text-right">
              Request
            </Label>
            <TextArea 
              placeholder="Describe the purpose of the meeting..." 
              className="col-span-3" 
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={async () => {
              await handleBooking(String(session?.user.id), recruiterUser.id, selectedTimeSlot, purpose, 40, recruiterUser.firstName + " " + recruiterUser.lastName);
              // setOpen(false);
              // toast({
              //   title: "Interview",
              //   description: "Interview request sent!",
              // })
              // router.refresh();
            }}
            type="submit"
          >
            Send Interview Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BookTimeModal;
