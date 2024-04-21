'use client'

import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

const sampleEvents = [
  { start: new Date() }
]

const AvailabilityCalendar = ({ events }: any) => {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        weekends={true}
        events={sampleEvents}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
      />
    </div>
  )
}

function handleEventClick(clickInfo: any) {
  console.log(clickInfo.event.title);
}

// a custom render function
function renderEventContent(eventInfo: any) {
  return (
    <div className='text-wrap'>
      <p className='text-bold'>{eventInfo.timeText} </p>
    </div>
  )
}

export default AvailabilityCalendar;