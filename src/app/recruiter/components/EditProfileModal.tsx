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

const validateSlug = async (slug: string) => {
  if (slug === '') {
    return false;
  }
  const response = await fetch(`/api/validate-slug?slug=${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const json = await response.json();
  return json.valid
}

// Inside your modal component or wherever the booking happens
const saveChanges = async (firstName: string, lastName: string, about: string, location: string, linkedinUrl: string, slug: string) => {
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
        slug
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
  const [slug, setSlug] = useState(recruiterUser.profile.slug ? recruiterUser.profile.slug : recruiterUser.id)
  const [slugError, setSlugError] = useState("");

  const initialSlug = recruiterUser.profile.slug ? recruiterUser.profile.slug : recruiterUser.id;

  const handleSlugChange = (value: string) => {
    if (value === "") {
      setSlug(value);
      setSlugError("");
      return;
    }
  
    const slugPattern = /^[a-z0-9-]+$/;
    
    const isSingleConsecutiveDash = !/--/.test(value); // Check for no consecutive dashes
    const dashCount = (value.match(/-/g) || []).length; // Count the dashes
  
    if (slugPattern.test(value) && isSingleConsecutiveDash && dashCount <= 2) {
      setSlug(value);
      setSlugError("");
    } else {
      let errorMessage = "Slug can only contain lowercase letters, numbers, and dashes.";
      if (!isSingleConsecutiveDash) {
        errorMessage = "Slug cannot contain consecutive dashes.";
      } else if (dashCount > 2) {
        errorMessage = "Slug cannot contain more than two dashes.";
      }
      setSlugError(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={false} variant="default">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slug" className="text-right">
              Custom Profile URL
            </Label>
            <div className="col-span-3 flex items-center">
              <span className="text-gray-700 mr-2">https://mockbird.ai/recruiter/</span>
              <Input 
                id="slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="flex-1"
              />
            </div>
            {slugError && <DialogDescription className="text-red-500 col-span-4">{slugError}</DialogDescription>}
          </div>
        </div>
        <DialogFooter>
          <LoadingButton
            disabled={false}
            onClick={async () => {
              setSlugError('');
              setLoading(true);
              if (initialSlug !== slug) {
                const validSlug = await validateSlug(slug);
                console.log(validSlug);
                if (!validSlug) {
                  setSlugError('This custom url is already taken.');
                  setLoading(false);
                  return;
                }
              }
              console.log("RAEREAREREAR")
              await saveChanges(firstName, lastName, about, location, linkedinUrl, slug)
              setOpen(false);
              toast({
                title: "Success!",
                description: "Updated user information",
              })
              router.push(`/recruiter/${slug}`)
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
