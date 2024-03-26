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

interface BookTimeModalProps {
  recruiterUser: RecruiterUser;
  recruiterProfile: RecruiterProfile;
}

export function BookTimeModal({ recruiterUser, recruiterProfile }: BookTimeModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Book Time</Button>
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
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Send Interview Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BookTimeModal;
