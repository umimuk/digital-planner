import { db } from '@/api/base44Client';
import { useState, useEffect } from "react";
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, addDays, isToday, isSameDay } from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useNavigate } from "react-router-dom";
import WeeklyGoalEditor from "../components/planner/WeeklyGoalEditor";
import ScheduleItem from "../components/planner/ScheduleItem";

const WEEKDAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];

export default function WeeklyView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekStartStr = format(weekStart, "yyyy-MM-dd");
  const weekLabel = `${format(weekStart, "M/d")} ~ ${format(weekEnd, "M/d")}`;

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    loadSchedules();
  }, [currentDate]);

  async function loadSchedules() {
    setLoading(true);
    const start = format(weekStart, "yyyy-MM-dd");
    const end = format(weekEnd, "yyyy-MM-dd");
    const data = await db.entities.Schedule.filter(
      { date: { $gte: start, $lte: end } },
      "date",
      100
    );
    setSchedules(data);
    setLoading(false);
  }

  function getSchedulesForDay(day) {
    return schedules.filter((s) => s.date === format(day, "yyyy-MM-dd"));
  }

  return (
    <div className="py-4 space-y-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-muted rounded-xl transition-colors active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="font-hand text-2xl text-foreground">{weekLabel}</h2>
        <button
          onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-muted rounded-xl transition-colors active:scale-95"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Weekly goal */}
      <WeeklyGoalEditor weekStart={weekStartStr} />

      {/* Week days */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2 animate-fade-in">
          {weekDays.map((day, i) => {
            const daySchedules = getSchedulesForDay(day);
            const today = isToday(day);
            const dayOfWeek = day.getDay();

            return (
              <button
                key={day.toISOString()}
                onClick={() => navigate(`/day/${format(day, "yyyy-MM-dd")}`)}
                className={`w-full text-left rounded-xl p-3 transition-all active:scale-[0.99] ${
                  today ? "bg-primary/10 ring-1 ring-primary/30" : "bg-card border border-border/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-center w-10">
                    <div
                      className={`text-xs ${
                        dayOfWeek === 0
                          ? "text-planner-pink"
                          : dayOfWeek === 6
                          ? "text-planner-sky"
                          : "text-muted-foreground"
                      }`}
                    >
                      {WEEKDAY_LABELS[i]}
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        today ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {daySchedules.length > 0 ? (
                      <div className="space-y-1">
                        {daySchedules.map((s) => (
                          <div key={s.id} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full bg-planner-${s.color || "pink"}`} />
                            <span className="text-sm text-foreground truncate">{s.title}</span>
                            {s.start_time && (
                              <span className="text-xs text-muted-foreground">{s.start_time}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">予定なし</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}