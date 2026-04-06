const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from "react";

import { Pencil, Check, BookHeart } from "lucide-react";

const MOODS = [
  { value: "happy", emoji: "😊" },
  { value: "good", emoji: "🙂" },
  { value: "normal", emoji: "😐" },
  { value: "tired", emoji: "😴" },
  { value: "sad", emoji: "😢" },
];

export default function DiaryEditor({ date }) {
  const [entry, setEntry] = useState(null);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("good");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntry();
  }, [date]);

  async function loadEntry() {
    setLoading(true);
    const entries = await db.entities.DiaryEntry.filter({ date });
    if (entries.length > 0) {
      setEntry(entries[0]);
      setContent(entries[0].content || "");
      setMood(entries[0].mood || "good");
    } else {
      setEntry(null);
      setContent("");
      setMood("good");
    }
    setLoading(false);
  }

  async function save() {
    const data = { date, content, mood };
    if (entry) {
      await db.entities.DiaryEntry.update(entry.id, data);
    } else {
      await db.entities.DiaryEntry.create(data);
    }
    setEditing(false);
    loadEntry();
  }

  if (loading) return null;

  return (
    <div className="bg-card rounded-xl p-4 border border-border/60 shadow-sm animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <BookHeart className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">ひとこと日記</span>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="ml-auto p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          {/* Mood selector */}
          <div className="flex gap-2 justify-center">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                  mood === m.value ? "bg-primary/15 scale-110 ring-2 ring-primary/30" : "bg-muted/50 hover:bg-muted"
                }`}
              >
                {m.emoji}
              </button>
            ))}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="今日のひとこと..."
            rows={3}
            className="w-full bg-muted/50 rounded-xl px-3 py-2.5 text-sm font-hand text-lg outline-none focus:ring-2 ring-primary/30 resize-none"
            autoFocus
          />

          <button
            onClick={save}
            className="w-full py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
          >
            <Check className="w-4 h-4 inline mr-1" />
            保存する
          </button>
        </div>
      ) : (
        <div>
          {entry?.mood && (
            <span className="text-xl mb-1 block">{MOODS.find((m) => m.value === entry.mood)?.emoji}</span>
          )}
          <p className="font-hand text-lg text-foreground/80 min-h-[24px]">
            {entry?.content || (
              <span className="text-muted-foreground text-base">タップして日記を書く 📝</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}