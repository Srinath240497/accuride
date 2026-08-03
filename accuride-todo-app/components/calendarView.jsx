// src/components/calendarView.jsx

// Import libraries
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

// Initialise Localizer
const localizer = momentLocalizer(moment);

/**
 *
 * @param {events, onSelectEvent, onSelectSlot, culture, data, view, onChangeView, onNavigate, currentDate} param0
 * @returns
 */
export default function CalendarView({
  events = [],
  onSelectEvent,
  onSelectSlot,
  culture = "en",
  date,
  view = "month",
  onChangeView,
  onNavigate,
  currentDate,
}) {
  // return the component
  return (
    <div className="mx-auto max-w-5xl mt-6">
      <Calendar
        localizer={localizer}
        events={events}
        date={date}
        startAccessor="start"
        endAccessor="end"
        culture={culture}
        selectable={true}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        style={{ height: "77vh" }}
        view={view}
        onView={onChangeView}
        onNavigate={onNavigate}
      />
    </div>
  );
}
