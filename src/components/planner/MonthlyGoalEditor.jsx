const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from "react";

import { Plus, X, Target, MessageCircle } from "lucide-react";

function GoalList({ items, onDelete, activeId, setActiveId }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-2 group"
        >
          <button
            onClick={() => setActiveId(activeId === item.id ? null : item.id)}
            className="flex-1 text-left text-base text-foreground/80 py-2 px-1 min-h-[44px] flex items-center"
          >
            {item.text}
          </button>
          {activeId === item.id && (
            <button
              onClick={() => { onDelete(item.id); setActiveId(null); }}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function AddInput({ onAdd, placeholder }) {
  const [value, setValue] = useState("");
  function submit() {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
  }
  return (
    <div className="flex gap-2 mt-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
        className="flex-1 bg-muted/50 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30 min-h-[44px]"
      />
      <button
        onClick={submit}
        className="w-11 h-11 flex items-center justify-center bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity flex-shrink-0"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function MonthlyGoalEditor({ yearMonth }) {
  const [record, setRecord] = useState(null);
  const [goals, setGoals] = useState([]);
  const [memos, setMemos] = useState([]);
  const [activeGoalId, setActiveGoalId] = useState(null);
  const [activeMemoId, setActiveMemoId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [yearMonth]);

  async function loadData() {
    setLoading(true);
    const results = await db.entities.MonthlyGoal.filter({ year_month: yearMonth });
    if (results.length > 0) {
      const r = results[0];
      setRecord(r);
      setGoals(r.goals_list || []);
      setMemos(r.memos_list || []);
    } else {
      setRecord(null);
      setGoals([]);
      setMemos([]);
    }
    setLoading(false);
  }

  async function save(newGoals, newMemos) {
    const data = {
      year_month: yearMonth,
      goals_list: newGoals,
      memos_list: newMemos,
    };
    if (record) {
      await db.entities.MonthlyGoal.update(record.id, data);
    } else {
      const created = await db.entities.MonthlyGoal.create(data);
      setRecord(created);
    }
  }

  async function addGoal(text) {
    const newGoals = [...goals, { id: Date.now().toString(), text }];
    setGoals(newGoals);
    await save(newGoals, memos);
    await loadData();
  }

  async function deleteGoal(id) {
    const newGoals = goals.filter((g) => g.id !== id);
    setGoals(newGoals);
    await save(newGoals, memos);
    await loadData();
  }

  async function addMemo(text) {
    const newMemos = [...memos, { id: Date.now().toString(), text }];
    setMemos(newMemos);
    await save(goals, newMemos);
    await loadData();
  }

  async function deleteMemo(id) {
    const newMemos = memos.filter((m) => m.id !== id);
    setMemos(newMemos);
    await save(goals, newMemos);
    await loadData();
  }

  if (loading) return null;

  return (
    <div
      className="space-y-3 animate-fade-in"
      onClick={() => { setActiveGoalId(null); setActiveMemoId(null); }}
    >
      {/* Goals */}
      <div
        className="bg-card rounded-xl p-4 border border-border/60 shadow-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">今月の目標</span>
        </div>
        {goals.length === 0 && (
          <p className="text-muted-foreground text-sm py-1">目標を追加してみましょう ✨</p>
        )}
        <GoalList
          items={goals}
          onDelete={deleteGoal}
          activeId={activeGoalId}
          setActiveId={setActiveGoalId}
        />
        <AddInput onAdd={addGoal} placeholder="目標を入力..." />
      </div>

      {/* Memos */}
      <div
        className="bg-card rounded-xl p-4 border border-border/60 shadow-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4 text-secondary-foreground" />
          <span className="text-sm font-medium text-foreground">今月のひとこと</span>
        </div>
        {memos.length === 0 && (
          <p className="text-muted-foreground text-sm py-1">ひとことメモを追加 💭</p>
        )}
        <GoalList
          items={memos}
          onDelete={deleteMemo}
          activeId={activeMemoId}
          setActiveId={setActiveMemoId}
        />
        <AddInput onAdd={addMemo} placeholder="ひとことを入力..." />
      </div>
    </div>
  );
}