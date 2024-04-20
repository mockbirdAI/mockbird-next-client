'use client'

import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

// const events = [
//   { title: 'Meeting', start: new Date() }
// ]

const Calendar = ({ events }: any) => {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        weekends={true}
        events={events}
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
      <p className='text-bold'>{eventInfo.timeText} {eventInfo.event.title}</p>
    </div>
  )
}

export default Calendar;