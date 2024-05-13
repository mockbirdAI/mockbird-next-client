'use client'

import LoadingButton from "@/common/components/LoadingButton";
import { toast } from "@/common/components/ui/use-toast";
import { useRouter } from "next/navigation"
import { useState } from "react";

export default function WithdrawButton({ disabled }: any) {
    const router = useRouter()
    const [disable, setDisable] = useState(disabled ? disabled : false);
    
    const handleClick = async () => {
      try {
        await fetch("/api/payout", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        router.refresh()
        toast({
          title: "Success",
          description: "Payout sent successfully",
          variant: 'default'
        });
      } catch (error){
        console.error(error)
      }
    }

    return (
        <LoadingButton
          onClick={handleClick}
          disabled={disable}
        >
          Withdraw
        </LoadingButton>
    )
}