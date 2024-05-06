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
import { useToast } from "../../../common/components/ui/use-toast";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { SelectTimeSlots } from "../../../common/components/SelectTimeSlot";
import { loadStripe } from '@stripe/stripe-js';
import LoadingButton from "../../../common/components/LoadingButton";
import { Profile, User } from "@prisma/client";

function formatPrice(price: number) {
  return price / 100;
}

// Inside your modal component or wherever the booking happens
const handleBooking = async (candidateId: string, recruiterId: string, proposedTime: Date | null, purpose: string, price: number, recruiterName: string, candidateEmail: string, recruiterEmail: string, candidateName: string) => {
  
};



export function BookTimeModal({ recruiterUser, recruiterProfile }: any) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");

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
        <Button onClick={validateAuth} disabled={false} variant="default">{"Edit"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Name</DialogTitle>
          <DialogDescription>
            Send a request to meet with {recruiterUser.firstName} here. Your interview request will be pending until they accept.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <div className="col-span-3">
              <SelectTimeSlots onChange={(e: Date) => setSelectedTimeSlot(e)} timeslots={futureAvailability} />
              <Input onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Service
            </Label>
            <div className="col-span-3">
              
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
            disabled={selectedTimeSlot === null || selectedService === ""}
            onClick={async () => {
              setLoading(true);
              await handleBooking(String(session?.user.id), recruiterUser.id, selectedTimeSlot, selectedService + " - " + purpose, Number(selectedServicePrice), recruiterUser.firstName + " " + recruiterUser.lastName, String(session?.user.email), recruiterUser.email, String(`${session?.user.firstName} ${session?.user.lastName}`) || "");
              setOpen(false);
              toast({
                title: "Success!",
                description: "Updated user information",
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
