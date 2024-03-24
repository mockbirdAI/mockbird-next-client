'use client'

import { useRouter } from "next/navigation"

export default function DeletePostButton({id}: {id: string | null}) {
    const router = useRouter()
    
    const handleDelete = async () => {
      try {
        await fetch(`/api/post/${id}`, {
          method: 'DELETE'
        })
        router.refresh()
      } catch (error){
        console.error(error)
      }
    }

    return (
        <button onClick={handleDelete}>Delete</button>
    )
}