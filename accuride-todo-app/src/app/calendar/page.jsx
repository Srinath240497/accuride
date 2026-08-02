"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import moment from "moment";
import CalendarView from "../../../components/calendarView";
import EventPopup from "../../../components/eventPopup";
import LogoutButton from "../../../components/logout";

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/todos");
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

  useEffect(() => {
    fetchEvents();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 font-medium">
        Loading session...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

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
    if (eventData.id) {
      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt.id === eventData.id ? { ...evt, ...eventData } : evt
        )
      );

      try {
        await fetch(`/api/todos?id=${eventData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
      } catch (err) {
        console.error("Failed to update event:", err);
      }
    } else {
      const tempId = "temp-" + Date.now();
      const newOptimisticEvent = { ...eventData, id: tempId };

      setEvents((prevEvents) => [...prevEvents, newOptimisticEvent]);

      try {
        const res = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
        const savedEvent = await res.json();

        setEvents((prevEvents) =>
          prevEvents.map((evt) =>
            evt.id === tempId
              ? {
                  ...savedEvent,
                  start: new Date(savedEvent.startDate),
                  end: new Date(savedEvent.endDate),
                }
              : evt
          )
        );
      } catch (err) {
        console.error("Failed to create event:", err);
        setEvents((prevEvents) =>
          prevEvents.filter((evt) => evt.id !== tempId)
        );
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    setEvents((prevEvents) => prevEvents.filter((evt) => evt.id !== eventId));
    try {
      await fetch(`/api/todos?id=${eventId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete event:", err);
      fetchEvents();
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
        <LogoutButton />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[500px] bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">
            Loading events from Hygraph...
          </p>
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
