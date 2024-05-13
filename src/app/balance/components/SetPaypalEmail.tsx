'use client'

import { Button } from "@/common/components/ui/Button"
import { Input } from "@/common/components/ui/Input"
import { toast } from "@/common/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SetPaypalEmail() {
    const router = useRouter()
    const [email, setEmail] = useState("");
    
    const handleClick = async () => {
      try {
        await fetch("/api/set-paypal-email", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email
          }),
        });
        router.refresh()
        toast({
          title: "Success",
          description: "Paypal payout email set successfully.",
          variant: 'default'
        });
      } catch (error){
        console.error(error)
      }
    }

    return (
      <div className='flex w-[380px]'>
        <Input onChange={(e) => setEmail(e.target.value)} placeholder='email'/>
        <Button onClick={handleClick}>Submit</Button>
      </div>
    )
}