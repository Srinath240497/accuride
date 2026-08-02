"use client";

import { useState, useEffect } from "react";
import moment from "moment";
import CalendarView from "../../../components/calendarView";
import EventPopup from "../../../components/eventPopup";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/todos?userId=1");
      const data = await res.json();

      if (Array.isArray(data)) {
        const formattedEvents = data.map((todo) => ({
          ...todo,
          start: new Date(todo.startDate),
          end: new Date(todo.endDate),
        }));
        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

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
      startDate: selectedDate.toISOString(),
      endDate: moment(selectedDate).add(1, "hours").toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (eventData?.id) {
        await fetch("/api/todos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: eventData.id,
            title: eventData.title,
            description: eventData.description,
            startDate: moment(eventData.startDate || eventData.start).toISOString(),
            endDate: moment(eventData.endDate || eventData.end).toISOString(),
            completed: eventData.completed || false,
          }),
        });
      } else {
        await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: eventData.title,
            description: eventData.description,
            startDate: moment(eventData.startDate || eventData.start).toISOString(),
            endDate: moment(eventData.endDate || eventData.end).toISOString(),
            userId: "1",
          }),
        });
      }

      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await fetch(`/api/todos?id=${id}`, { method: "DELETE" });
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("Delete failed:", err);
    }
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

      {loading ? (
        <div className="flex justify-center items-center h-[500px] bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">Loading events from Hygraph...</p>
        </div>
      ) : (
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
      )}

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