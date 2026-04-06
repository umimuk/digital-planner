const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft, Plus } from "lucide-react";

import ScheduleItem from "../components/planner/ScheduleItem";
import ScheduleForm from "../components/planner/ScheduleForm";
import DiaryEditor from "../components/planner/DiaryEditor";

export default function DailyDetail() {
  const { date } = useParams();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const parsedDate = parseISO(date);
  const dayLabel = format(parsedDate, "M月d日（E）", { locale: ja });

  useEffect(() => {
    loadSchedules();
  }, [date]);

  async function loadSchedules() {
    setLoading(true);
    const data = await db.entities.Schedule.filter({ date }, "start_time", 50);
    setSchedules(data);
    setLoading(false);
  }

  function openEdit(schedule) {
    setEditingSchedule(schedule);
    setFormOpen(true);
  }

  function openCreate() {
    setEditingSchedule(null);
    setFormOpen(true);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-muted rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-hand text-2xl text-foreground flex-1">{dayLabel}</h1>
          <button
            onClick={openCreate}
            className="p-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-8">
        {/* Schedules */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">予定</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : schedules.length > 0 ? (
            <div className="space-y-2 animate-fade-in">
              {schedules.map((s) => (
                <ScheduleItem key={s.id} schedule={s} onClick={() => openEdit(s)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 animate-fade-in">
              <p className="font-hand text-xl text-muted-foreground mb-2">予定はありません</p>
              <button
                onClick={openCreate}
                className="text-sm text-primary hover:underline"
              >
                ＋ 予定を追加する
              </button>
            </div>
          )}
        </div>

        {/* Diary */}
        <DiaryEditor date={date} />
      </div>

      {/* Schedule Form Dialog */}
      {formOpen && (
        <ScheduleForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingSchedule(null);
          }}
          date={date}
          schedule={editingSchedule}
          onSaved={loadSchedules}
        />
      )}
    </div>
  );
}