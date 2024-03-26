'use client';

import React from "react";
import { Button, buttonVariants } from "./ui/Button";
import { signOut } from "next-auth/react";
import { toast, useToast } from "@/common/components/ui/use-toast";

const SignOutButton = () => {
  return (
    <Button
      className={buttonVariants({
        variant: "destructive",
        size: "sm",
      })}
      onClick={(event) => {
        event?.preventDefault()
        // toast({
        //   title: "Signed out",
        //   description: "You have been signed out.",
        // })
        signOut({
          redirect: true,
          callbackUrl: "/sign-in",
        });
      }}
    >
      Sign Out
    </Button>
  )
}

export default SignOutButton;