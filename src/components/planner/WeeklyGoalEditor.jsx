import { db } from '@/api/base44Client';
import { useState, useEffect } from "react";

import { Pencil, Check, Flag } from "lucide-react";

export default function WeeklyGoalEditor({ weekStart }) {
  const [goal, setGoal] = useState(null);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoal();
  }, [weekStart]);

  async function loadGoal() {
    setLoading(true);
    const goals = await db.entities.WeeklyGoal.filter({ week_start: weekStart });
    if (goals.length > 0) {
      setGoal(goals[0]);
      setText(goals[0].goal || "");
    } else {
      setGoal(null);
      setText("");
    }
    setLoading(false);
  }

  async function save() {
    const data = { week_start: weekStart, goal: text };
    if (goal) {
      await db.entities.WeeklyGoal.update(goal.id, data);
    } else {
      await db.entities.WeeklyGoal.create(data);
    }
    setEditing(false);
    loadGoal();
  }

  if (loading) return null;

  return (
    <div className="bg-card rounded-xl p-4 border border-border/60 shadow-sm animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Flag className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">今週の目標</span>
        {!editing && (
          <button onClick={() => setEditing(true)} className="ml-auto p-1 hover:bg-muted rounded-lg transition-colors">
            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
      {editing ? (
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="今週の目標..."
            className="flex-1 bg-muted/50 rounded-lg px-3 py-2 text-sm font-hand text-lg outline-none focus:ring-2 ring-primary/30"
            autoFocus
          />
          <button onClick={save} className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <Check className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <p className="font-hand text-xl text-foreground/80 min-h-[28px]">
          {goal?.goal || <span className="text-muted-foreground text-base">タップして目標を追加 🎯</span>}
        </p>
      )}
    </div>
  );
}