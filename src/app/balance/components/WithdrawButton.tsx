'use client'

import { Button } from "@/common/components/ui/Button"
import { useRouter } from "next/navigation"

export default function WithdrawButton() {
    const router = useRouter()
    
    const handleClick = async () => {
      try {
        await fetch("/api/payout", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        router.refresh()
      } catch (error){
        console.error(error)
      }
    }

    return (
        <Button onClick={handleClick}>Withdraw</Button>
    )
}