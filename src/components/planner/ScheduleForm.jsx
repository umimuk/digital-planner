import { db } from '@/api/base44Client';
import { useState } from "react";

import { X, Heart, Star, Flower2, Cake, Briefcase, BookOpen, Music, Coffee } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const COLORS = [
  { value: "pink", label: "ピンク", class: "bg-planner-pink" },
  { value: "lavender", label: "ラベンダー", class: "bg-planner-lavender" },
  { value: "mint", label: "ミント", class: "bg-planner-mint" },
  { value: "peach", label: "ピーチ", class: "bg-planner-peach" },
  { value: "sky", label: "スカイ", class: "bg-planner-sky" },
];

const ICONS = [
  { value: "heart", Icon: Heart },
  { value: "star", Icon: Star },
  { value: "flower", Icon: Flower2 },
  { value: "cake", Icon: Cake },
  { value: "briefcase", Icon: Briefcase },
  { value: "book", Icon: BookOpen },
  { value: "music", Icon: Music },
  { value: "coffee", Icon: Coffee },
];

export default function ScheduleForm({ open, onClose, date, schedule, onSaved }) {
  const isEdit = !!schedule;
  const [title, setTitle] = useState(schedule?.title || "");
  const [startTime, setStartTime] = useState(schedule?.start_time || "");
  const [endTime, setEndTime] = useState(schedule?.end_time || "");
  const [memo, setMemo] = useState(schedule?.memo || "");
  const [color, setColor] = useState(schedule?.color || "pink");
  const [icon, setIcon] = useState(schedule?.icon || "heart");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    const data = { title, date, start_time: startTime, end_time: endTime, memo, color, icon };
    if (isEdit) {
      await db.entities.Schedule.update(schedule.id, data);
    } else {
      await db.entities.Schedule.create(data);
    }
    setSaving(false);
    onSaved();
    onClose();
  }

  async function handleDelete() {
    if (!isEdit) return;
    await db.entities.Schedule.delete(schedule.id);
    onSaved();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-hand text-2xl">
            {isEdit ? "予定を編集" : "予定を追加"} ✏️
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">タイトル</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="予定のタイトル"
              className="w-full bg-muted/50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 ring-primary/30"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">開始</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-muted/50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">終了</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-muted/50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 ring-primary/30"
              />
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">カラー</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.class} transition-all ${
                    color === c.value ? "ring-2 ring-offset-2 ring-foreground/30 scale-110" : "hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Icon picker */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">アイコン</label>
            <div className="flex gap-2 flex-wrap">
              {ICONS.map((ic) => (
                <button
                  key={ic.value}
                  onClick={() => setIcon(ic.value)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    icon === ic.value
                      ? "bg-primary text-primary-foreground scale-110"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <ic.Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">メモ</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="メモを追加..."
              rows={2}
              className="w-full bg-muted/50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 ring-primary/30 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            {isEdit && (
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 text-sm text-destructive bg-destructive/10 rounded-xl hover:bg-destructive/20 transition-colors"
              >
                削除
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="flex-1 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存する"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}