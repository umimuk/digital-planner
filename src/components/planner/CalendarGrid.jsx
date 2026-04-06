import { useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday } from "date-fns";
import { useNavigate } from "react-router-dom";

const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日"];

export default function CalendarGrid({ currentDate, schedules }) {
  const navigate = useNavigate();

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const result = [];
    let day = calStart;
    while (day <= calEnd) {
      result.push(new Date(day));
      day = addDays(day, 1);
    }
    return result;
  }, [currentDate]);

  function getSchedulesForDay(day) {
    const dateStr = format(day, "yyyy-MM-dd");
    return schedules.filter((s) => s.date === dateStr);
  }

  function getColorDot(color) {
    const colors = {
      pink: "bg-planner-pink",
      lavender: "bg-planner-lavender",
      mint: "bg-planner-mint",
      peach: "bg-planner-peach",
      sky: "bg-planner-sky",
    };
    return colors[color] || "bg-primary";
  }

  return (
    <div className="animate-fade-in">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-medium py-2 ${
              i === 5 ? "text-planner-sky" : i === 6 ? "text-planner-pink" : "text-muted-foreground"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-[2px]">
        {days.map((day) => {
          const inMonth = isSameMonth(day, currentDate);
          const today = isToday(day);
          const daySchedules = getSchedulesForDay(day);
          const dayOfWeek = day.getDay();

          return (
            <button
              key={day.toISOString()}
              onClick={() => navigate(`/day/${format(day, "yyyy-MM-dd")}`)}
              className={`relative flex flex-col items-center py-2 min-h-[52px] rounded-xl transition-all active:scale-95 touch-manipulation ${
                inMonth ? "hover:bg-muted/80" : "opacity-30"
              } ${today ? "bg-primary/10 ring-1 ring-primary/30" : ""}`}
            >
              <span
                className={`text-sm leading-none ${
                  today
                    ? "font-bold text-primary"
                    : dayOfWeek === 0
                    ? "text-planner-pink"
                    : dayOfWeek === 6
                    ? "text-planner-sky"
                    : "text-foreground"
                }`}
              >
                {format(day, "d")}
              </span>

              {/* Schedule dots */}
              {daySchedules.length > 0 && (
                <div className="flex gap-[3px] mt-1 flex-wrap justify-center max-w-[36px]">
                  {daySchedules.slice(0, 3).map((s, i) => (
                    <div
                      key={i}
                      className={`w-[5px] h-[5px] rounded-full ${getColorDot(s.color)}`}
                    />
                  ))}
                  {daySchedules.length > 3 && (
                    <span className="text-[8px] text-muted-foreground leading-none">+{daySchedules.length - 3}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}