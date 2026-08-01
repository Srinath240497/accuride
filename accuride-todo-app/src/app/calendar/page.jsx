"use client";

import { useState } from "react";
import moment from "moment";
import CalendarView from "../../../components/calendarView";
import EventPopup from "../../../components/eventPopup";
import { myEventsList } from "../../../constants/events";

export default function CalendarPage() {
  const [events, setEvents] = useState(myEventsList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView) => {
    setCurrentView(newView);
  };

  const handleSelectEvent = (event) => {
    setActiveEvent(event);
    setIsModalOpen(true);
  };

  const handleSelectSlot = (slotInfo) => {
    const selectedDate = moment(slotInfo.start);
    setActiveEvent({
      start: selectedDate.toDate(),
      end: moment(selectedDate).add(1, "hours").toDate(),
      dueDate: selectedDate.toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData) => {
    if (eventData?.id) {
      setEvents((prev) =>
        prev.map((item) => (item.id === eventData?.id ? eventData : item))
      );
    } else {
      const newEvent = { ...eventData, id: Date.now().toString() };
      setEvents((prev) => [...prev, newEvent]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((item) => item.id !== id));
    setIsModalOpen(false);
  };

  return (
    <main className="max-w-6xl mx-auto p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Event Calendar View
        </h1>
        <button
          onClick={() => {
            setActiveEvent(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
        >
          + Add Event
        </button>
      </div>

      <CalendarView
        events={events}
        culture="en"
        date={currentDate}
        view={currentView}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onChangeView={handleViewChange}
        onNavigate={handleNavigate}
      />

      <EventPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={activeEvent}
      />
    </main>
  );
}