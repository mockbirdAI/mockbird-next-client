'use client';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/Select"
import { Input } from "@/common/components/ui/Input"
import { Label } from "@/common/components/ui/Label"
import { TextArea } from "@/common/components/ui/TextArea";
import prisma from "@/lib/prisma";
import { useSession } from "next-auth/react";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { SelectTimeSlots } from "./SelectTimeSlot";
import { loadStripe } from '@stripe/stripe-js';
import LoadingButton from "./LoadingButton";
import { Profile, User } from "@prisma/client";

interface BookTimeModalProps {
  disabled?: boolean;
  recruiterUser: User;
  recruiterProfile: Profile;
  services: any[];
}

const stripePromise = loadStripe(
  String(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
);

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return hours === 1 ? "1 hour" : `${hours} hours`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 min" : `${minutes} min`;
  }
  return `${seconds} seconds`; // Handle cases where duration is less than a minute
}

function formatPrice(price: number) {
  return price / 100;
}

// Inside your modal component or wherever the booking happens
const handleBooking = async (candidateId: string, recruiterId: string, proposedTime: Date | null, purpose: string, price: number, recruiterName: string, candidateEmail: string, recruiterEmail: string, candidateName: string) => {
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
      candidateEmail: candidateEmail,
      recruiterEmail: recruiterEmail,
      candidateName: candidateName,
      recruiterName: recruiterName
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


const handleBookingWithoutStripe = async (candidateId: string, recruiterId: string, proposedTime: Date | null, purpose: string, paymentId: string, stripeSessionId: string, candidateEmail: string, recruiterEmail: string, candidateName: string, recruiterName: string) => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/create-interview-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        candidateId,
        recruiterId,
        purpose,
        proposedTime,
        paymentId, 
        candidateEmail,
        recruiterEmail,
        candidateName,
        recruiterName,
        stripeSessionId
      })
    });
  } catch (error) {
    console.error(error);
  }
}

export function BookTimeModal({ disabled, recruiterUser, recruiterProfile, services }: BookTimeModalProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [selectedService, setSelectedService] = useState("");
  const [selectedServiceDuration, setSelectedServiceDuration] = useState(0);
  const [selectedServicePrice, setSelectedServicePrice] = useState(0);

  const currentTime = new Date().getTime();
  const futureAvailability = recruiterUser.availability.filter((date: string | number | Date) => new Date(date).getTime() > currentTime);

  const validateAuth = () => {
    if (!session?.user) {
      router.push('/sign-in')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={validateAuth} disabled={disabled} variant="default">{disabled ? "Pending..." : "Book Time"}</Button>
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
              <SelectTimeSlots onChange={(e: Date) => setSelectedTimeSlot(e)} timeslots={futureAvailability} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Service
            </Label>
            <div className="col-span-3">
              <Select 
                onValueChange={(e) => {
                  const serviceObject = services.find((service) => service.service === e);
                  console.log(serviceObject);
                  if (serviceObject) {
                    setSelectedService(serviceObject.service)
                    setSelectedServiceDuration(serviceObject.duration);
                    setSelectedServicePrice(serviceObject.price);
                  }
                }} 
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {
                      services.map((service) => (
                        <SelectItem key={service.service} value={service.service}>
                          {`${service.service} - ${formatDuration(service.duration)} - $${formatPrice(service.price)}`}
                        </SelectItem>
                      ))
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
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
          <LoadingButton
            onClick={async () => {
              setLoading(true);
              await handleBooking(String(session?.user.id), recruiterUser.id, selectedTimeSlot, selectedService + " - " + purpose, Number(selectedServicePrice), recruiterUser.firstName + " " + recruiterUser.lastName, String(session?.user.email), recruiterUser.email, String(`${session?.user.firstName} ${session?.user.lastName}`) || "");
              setOpen(false);
              toast({
                title: "Interview",
                description: "Interview request sent!",
              })
              router.refresh();
              setLoading(false);
            }}
            loading={loading}
            type="submit"
          >
            Send Interview Request
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BookTimeModal;
