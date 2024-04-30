'use client'

import React, { useState } from 'react'
import ScheduleSelector from 'react-schedule-selector'
import { Button } from '@/common/components/ui/Button';
import { useSession } from 'next-auth/react';
import { toast } from '@/common/components/ui/use-toast';
import ServicesMultiSelect from '@/common/components/ServicesMultiSelect';


const Availability = ({ schedule }: any) => {
  const { data: session } = useSession();
  const [currSchedule, setCurrSchedule] = useState(schedule || []);

  function handleChange(newSchedule: any) {
    setCurrSchedule(newSchedule)
  }

  async function handleSave() {
    try {
      const response = await fetch('/api/set-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user.id,
          availability: currSchedule
        }),
      });
      console.log(response);
      toast({
        title: "Success",
        description: "Availability updated successfully.",
        variant: 'default'
      });
    } catch (error) {
      console.error(error);
    }
  }

  const services = [
    {
      id: 1,
      service: "Coffee Chat",
      duration: 900,
      price: 0
    },
    {
      id: 2,
      service: "Resume Review",
      duration: 900,
      price: 0
    },
    {
      id: 3,
      service: "Behavioral Mock Interview",
      duration: 3600,
      price: 2000,
    },
    {
      id: 4,
      service: "Technical Mock Interview",
      duration: 3600,
      price: 3000
    }
  ]

  return (
    <div className='flex justify-center'>
      <div className='w-1/2 h-1/2'>
        <ScheduleSelector
          columnGap='4px'
          rowGap='4px'
          selection={currSchedule}
          numDays={7}
          minTime={8}
          maxTime={22}
          hourlyChunks={1}
          onChange={handleChange}
        />
        <div className="mt-5 ms-10">
          <Button onClick={() => handleSave()}>
            Save
          </Button>
        </div>
      </div>
      <div className='w-1/2 h-1/2'>
        <div className='flex justify-center'>
          Services
        </div>
        <ServicesMultiSelect services={services} />
      </div>
      
    </div>
  )
}

export default Availability;