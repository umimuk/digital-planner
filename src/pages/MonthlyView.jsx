const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import ScheduleForm from "../components/planner/ScheduleForm";

import CalendarGrid from "../components/planner/CalendarGrid";
import MonthlyGoalEditor from "../components/planner/MonthlyGoalEditor";

export default function MonthlyView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const yearMonth = format(currentDate, "yyyy-MM");
  const monthLabel = format(currentDate, "yyyy年 M月", { locale: ja });

  useEffect(() => {
    loadSchedules();
  }, [currentDate]);

  async function loadSchedules() {
    setLoading(true);
    const start = format(startOfMonth(currentDate), "yyyy-MM-dd");
    const end = format(endOfMonth(currentDate), "yyyy-MM-dd");
    const data = await db.entities.Schedule.filter(
      { date: { $gte: start, $lte: end } },
      "date",
      100
    );
    setSchedules(data);
    setLoading(false);
  }

  return (
    <div className="py-4 space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-muted rounded-xl transition-colors active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="font-hand text-3xl text-foreground tracking-wide">{monthLabel}</h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-muted rounded-xl transition-colors active:scale-95"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-card rounded-2xl p-3 border border-border/60 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <CalendarGrid currentDate={currentDate} schedules={schedules} />
        )}
      </div>

      {/* Add Schedule Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="w-full flex items-center justify-center gap-2 py-3 min-h-[48px] rounded-2xl border-2 border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors active:scale-[0.98]"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">予定を追加</span>
      </button>

      {/* Monthly Goal & Memo */}
      <MonthlyGoalEditor yearMonth={yearMonth} />

      {showAddForm && (
        <ScheduleForm
          open={showAddForm}
          onClose={() => setShowAddForm(false)}
          date={format(new Date(), "yyyy-MM-dd")}
          schedule={null}
          onSaved={loadSchedules}
        />
      )}
    </div>
  );
}