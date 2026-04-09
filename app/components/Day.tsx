import { isSameDay, isWithinInterval } from "date-fns";

export default function Day({
  date,
  startDate,
  endDate,
  onClick,
  event,
  noteColor,
}: {
  date: Date;
  startDate: Date | null;
  endDate: Date | null;
  onClick: (date: Date) => void;
  event?: any;
  noteColor?: string;
}) {
  const isStart = startDate && isSameDay(date, startDate);
  const isEnd = endDate && isSameDay(date, endDate);

  const isInRange =
    startDate &&
    endDate &&
    isWithinInterval(date, { start: startDate, end: endDate });

  return (
    <div
      onClick={() => onClick(date)}
      style={{
        backgroundColor: isInRange ? undefined : noteColor,
      }}
      className={`
        h-10 flex items-center relative first-letter:justify-center rounded-lg cursor-pointer
        text-sm transition-all duration-200
      ${isInRange ? "bg-blue-200" : ""}
${isStart ? "bg-blue-500 text-white scale-105" : ""}
${isEnd ? "bg-blue-500 text-white scale-105" : ""}
        hover:bg-blue-100
      `}
    >
        {/* ICONS */}
{event?.icons && (
  <div
    className="absolute top-1 right-1 flex gap-1"
  >
    {event.icons.map((icon: any, i: number) => (
      <span key={i}>{icon}</span>
    ))}
  </div>
)}

{/* DOTS */}
{event?.dots && (
  <div className="absolute bottom-1 flex gap-1">
    {event.dots.map((color: string, i: number) => (
      <span
        key={i}
        className={`w-1.5 h-1.5 rounded-full ${
          color === "yellow"
            ? "bg-yellow-400"
            : color === "purple"
            ? "bg-purple-400"
            : "bg-blue-400"
        }`}
      />
    ))}
  </div>
)}
      {date.getDate()}
    </div>
  );
}