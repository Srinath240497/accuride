// src/components/eventPopup.jsx
"use client";

// Import react hooks
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";

// Import moment
import moment from "moment";

/**
 *
 * @param {isOpen, onClose, onSave, onDelete, event} param0
 * @returns
 */
export default function EventPopup({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
}) {
  // Initialise States
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mounted, setMounted] = useState(false);

  /**
   * Use Effect
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Use Effect with Dependencies
   * event
   * isOpen
   */
  useEffect(() => {
    if (event) {
      setTitle(event?.title || "");
      setDescription(event?.description || "");

      const startData = event?.start || event?.startDate || moment();
      const endData =
        event?.end || event?.endDate || moment(startData).add(1, "hours");

      setStartDate(moment(startData).format("YYYY-MM-DDTHH:mm"));
      setEndDate(moment(endData).format("YYYY-MM-DDTHH:mm"));
    } else {
      setTitle("");
      setDescription("");
      setStartDate(moment().format("YYYY-MM-DDTHH:mm"));
      setEndDate(moment().add(1, "hours").format("YYYY-MM-DDTHH:mm"));
    }
  }, [event, isOpen]);

  if (!isOpen || !mounted) return null;

  /**
   * Function Handle Submit
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const startMoment = moment(startDate);
    const endMoment = moment(endDate);

    onSave({
      id: event?.id,
      title,
      description,
      start: startMoment.toDate(),
      end: endMoment.toDate(),
      startDate: startMoment.toISOString(),
      endDate: endMoment.toISOString(),
      userId: userId,
    });

    onClose();
  };

  /**
   * Initialise React Dom Portal
   */
  const modalMarkup = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "20px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {event?.id ? "Edit Event" : "New Event"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event Title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event details..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-white"
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            {event?.id ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(event.id);
                  onClose();
                }}
                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 font-medium transition-colors cursor-pointer"
              >
                Delete
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-medium transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  // return component
  return createPortal(modalMarkup, document.body);
}
