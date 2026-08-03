// src/app/calendar/page.jsx
"use client";

// Import React Hooks
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Import Library
import moment from "moment";

// Import Components
import CalendarView from "../../../components/calendarView";
import EventPopup from "../../../components/eventPopup";
import LogoutButton from "../../../components/logout";

/**
 *
 * Calendar Page
 *
 * @returns
 */
export default function CalendarPage() {
  // Initialise React Hooks Variables
  const { data: session, status } = useSession();
  const router = useRouter();
  // Initialise State
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [loading, setLoading] = useState(true);

  /**
   * Use Effect
   */
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  /**
   * Fetch Events
   */
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

  /**
   * Use Effect with Dependencies
   * status
   */
  useEffect(() => {
    if (status === "authenticated") {
      fetchEvents();
    }
  }, [status]);

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

  /**
   *
   * @param {newDate} newDate
   */
  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  /**
   *
   * @param {newView} newView
   */
  const handleViewChange = (newView) => {
    setCurrentView(newView);
  };

  /**
   *
   * @param {event} event
   */
  const handleSelectEvent = (event) => {
    setActiveEvent(event);
    setIsModalOpen(true);
  };

  /**
   *
   * @param {slotInfo} slotInfo
   */
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

  /**
   *
   * @param {eventData} eventData
   */
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
        fetchEvents();
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

  /**
   *
   * @param {eventId} eventId
   */
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveEvent(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
          >
            + Add Event
          </button>
          <LogoutButton />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[500px] bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">Loading events...</p>
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
