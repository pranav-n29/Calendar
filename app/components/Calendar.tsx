"use client";
import { RiNetflixFill, RiClaudeFill } from "react-icons/ri";
import { FaAmazon } from "react-icons/fa";
import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isWithinInterval,
} from "date-fns";
import Day from "./Day";
import type { SavedNote } from "../page";

const EVENTS: Record<string, any> = {
  "2026-4-2": {
    icons: [<RiNetflixFill color="red" size={14} />],
    dots: ["yellow"],
  },
 
  "2026-4-10": {
    icons: [<RiClaudeFill color="#827BFF" size={14} />],
    dots: ["purple"],
  },
  "2026-4-25": {
    icons: [<FaAmazon color="#000" size={14} />],
    dots: ["yellow"],
  },
};
export default function Calendar({
  notes,
  onRangeSelect,
}: {
  notes: SavedNote[];
  onRangeSelect: (start: Date, end: Date) => void;
}) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const generateCalendar = (date: Date) => {
    const startMonth = startOfMonth(date);
    const endMonth = endOfMonth(date);

    const startDate = startOfWeek(startMonth);
    const endDate = endOfWeek(endMonth);

    const days: Date[] = [];
    let current = startDate;

    while (current <= endDate) {
      days.push(current);
      current = addDays(current, 1);
    }

    return days;
  };

  const days = generateCalendar(currentDate);

  const handleDateClick = (date: Date) => {
    if (!startDate || endDate) {
      setStartDate(date);
      setEndDate(null);
    } else if (date >= startDate) {
      setEndDate(date);
      onRangeSelect(startDate, date);
    } else {
      setStartDate(date);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-5">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
          ◀
        </button>

        <h2 className="font-bold text-lg">
          {format(currentDate, "MMMM yyyy")}
        </h2>

        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
          ▶
        </button>
      </div>

     <div className="grid grid-cols-7 mb-2 text-xs text-gray-500 font-medium">
  {daysOfWeek.map((day) => (
    <div key={day} className="text-center">
      {day}
    </div>
  ))}
</div>
      {/* Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
  const eventKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
  const matchedNote = notes.find((note) => {
    const rangeStart = new Date(note.start);
    const rangeEnd = new Date(note.end);

    return isWithinInterval(day, { start: rangeStart, end: rangeEnd });
  });

  return (
    <Day
      key={index}
      date={day}
      startDate={startDate}
      endDate={endDate}
      onClick={handleDateClick}
      event={EVENTS[eventKey]}
      noteColor={matchedNote?.color}
    />
  );
})}
      </div>
    </div>
  );
}