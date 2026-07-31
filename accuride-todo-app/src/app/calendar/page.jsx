"use client";

import { useState } from "react";
import CalendarView from "../../../components/calendarView";
import { myEventsList } from "../../../constants/events";

export default function CalendarPage() {
  const [events, setEvents] = useState(myEventsList);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isOpenEvent, setIsOpenEvent] = useState(false);

  const handleSelectEvent = (event) => {
    console.log("Selected Event:", event);
    setSelectedEvent(event);
    setIsOpenEvent(true);
  };

  const handleSelectSlot = (slotInfo) => {
    console.log("Selected Slot:", slotInfo);
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Event Calendar View
      </h1>

      <CalendarView
        events={events}
        culture="en"
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
      />
    </main>
  );
}