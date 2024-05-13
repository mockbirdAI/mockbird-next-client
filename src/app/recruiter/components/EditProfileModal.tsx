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
import { Input } from "@/common/components/ui/Input"
import { Label } from "@/common/components/ui/Label"
import { TextArea } from "@/common/components/ui/TextArea";
import { toast, useToast } from "../../../common/components/ui/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "../../../common/components/LoadingButton";

function formatPrice(price: number) {
  return price / 100;
}

// Inside your modal component or wherever the booking happens
const saveChanges = async (firstName: string, lastName: string, about: string, location: string, linkedinUrl: string) => {
  try {
    await fetch("/api/update-basic-profile", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName,
        lastName,
        about,
        location,
        linkedinUrl,
      }),
    });
    toast({
      title: "Success",
      description: "Saved changes.",
      variant: 'default'
    });
  } catch (error) {
    console.error(error)
    toast({
      title: "Error",
      description: "Error has occured.",
      variant: 'destructive'
    });
  }
};



export function EditProfileModal({ recruiterUser }: any) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [firstName, setFirstName] = useState(recruiterUser.firstName);
  const [lastName, setLastName] = useState(recruiterUser.lastName);

  const [about, setAbout] = useState(recruiterUser.profile.bio);
  const [location, setLocation] = useState(recruiterUser.profile.currentLocation)
  const [linkedinUrl, setLinkedinUrl] = useState(recruiterUser.profile.linkedinUrl)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={false} variant="default">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Please note that changes will not be saved without submitting.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              First Name
            </Label>
            <div className="col-span-3">
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Last Name
            </Label>
            <div className="col-span-3">
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Current Location
            </Label>
            <div className="col-span-3">
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              LinkedIn URL
            </Label>
            <div className="col-span-3">
              <Input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="purpose" className="text-right">
              About
            </Label>
            <TextArea 
              placeholder="Describe the purpose of the meeting..." 
              className="col-span-3" 
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <LoadingButton
            disabled={false}
            onClick={async () => {
              setLoading(true);
              await saveChanges(firstName, lastName, about, location, linkedinUrl)
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
            Save
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileModal;
