import { Calendar, momentLocalizer } from "react-big-calendar";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from "moment";

const localizer = momentLocalizer(moment);

export default function CalendarView({
  events = [],
  onSelectEvent,
  onSelectSlot,
  culture = "en",
}) {
  return (
    <div className="mx-auto max-w-5xl mt-10">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        culture={culture}
        selectable={true}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        style={{ height: '77vh' }}
      />
    </div>
  );
}