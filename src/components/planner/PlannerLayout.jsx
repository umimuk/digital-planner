import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar, CalendarDays, Settings, X } from "lucide-react";

const FONTS = [
  { value: "'Kiwi Maru', serif", label: "デフォルト" },
  { value: "'Hachi Maru Pop', cursive", label: "かわいい" },
  { value: "'Zen Kurenaido', sans-serif", label: "きれい" },
  { value: "'Klee One', cursive", label: "しずか" },
];

const SIZES = [
  { value: "14px", label: "小" },
  { value: "16px", label: "中" },
  { value: "18px", label: "大" },
];

const THEMES = [
  { key: "pink",      primary: "340 45% 65%", bg: "30 50% 97%",  swatch: "#F2A7B3" },
  { key: "gray",      primary: "220 10% 55%", bg: "220 10% 97%", swatch: "#A0A8B0" },
  { key: "yellow",    primary: "40 70% 60%",  bg: "45 60% 97%",  swatch: "#E8C56A" },
  { key: "blue",      primary: "210 50% 62%", bg: "210 40% 97%", swatch: "#85B4D9" },
  { key: "green",     primary: "150 35% 52%", bg: "150 30% 97%", swatch: "#7EC8A0" },
  { key: "deeppink",  primary: "335 55% 52%", bg: "340 40% 97%", swatch: "#D96090" },
  { key: "lightpink", primary: "350 60% 76%", bg: "350 50% 98%", swatch: "#F5B8C4" },
  { key: "greige",    primary: "30 18% 58%",  bg: "30 20% 97%",  swatch: "#BDB0A5" },
];

function applyTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--ring", theme.primary);
  root.style.setProperty("--background", theme.bg);
  root.style.setProperty("--sidebar-primary", theme.primary);
  root.style.setProperty("--chart-1", theme.primary);
}

const navItems = [
  { path: "/", icon: Calendar, label: "月間" },
  { path: "/weekly", icon: CalendarDays, label: "週間" },
];

export default function PlannerLayout() {
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  const [selectedFont, setSelectedFont] = useState(
    () => localStorage.getItem("planner-font") || FONTS[0].value
  );
  const [selectedSize, setSelectedSize] = useState(
    () => localStorage.getItem("planner-size") || SIZES[1].value
  );
  const [selectedTheme, setSelectedTheme] = useState(
    () => localStorage.getItem("planner-theme") || THEMES[0].key
  );

  useEffect(() => {
    document.documentElement.style.setProperty("--font-body", selectedFont);
    document.documentElement.style.setProperty("--font-hand", selectedFont);
    document.documentElement.style.setProperty("--font-klee", selectedFont);
    localStorage.setItem("planner-font", selectedFont);
  }, [selectedFont]);

  useEffect(() => {
    document.documentElement.style.fontSize = selectedSize;
    localStorage.setItem("planner-size", selectedSize);
  }, [selectedSize]);

  useEffect(() => {
    const theme = THEMES.find((t) => t.key === selectedTheme) || THEMES[0];
    applyTheme(theme);
    localStorage.setItem("planner-theme", selectedTheme);
  }, [selectedTheme]);

  return (
    <div className="bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="w-8" />
          <h1 className="font-hand text-3xl text-primary tracking-wide">My Planner</h1>
          <button
            onClick={() => setShowSettings((v) => !v)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            title="設定"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowSettings(false)}>
          <div
            className="bg-card w-full max-w-sm mx-4 rounded-3xl border border-border shadow-2xl p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-hand text-xl text-foreground">設定</span>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-muted rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Color */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-3">カラー</p>
              <div className="flex gap-3 flex-wrap">
                {THEMES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setSelectedTheme(t.key)}
                    style={{ backgroundColor: t.swatch }}
                    className={`w-11 h-11 rounded-full transition-all ${
                      selectedTheme === t.key ? "ring-2 ring-offset-2 ring-foreground/40 scale-110" : "hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Font */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-3">フォント</p>
              <div className="flex gap-2 flex-wrap">
                {FONTS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setSelectedFont(f.value)}
                    style={{ fontFamily: f.value }}
                    className={`px-4 py-2.5 rounded-xl text-sm transition-all min-h-[44px] ${
                      selectedFont === f.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-3">文字サイズ</p>
              <div className="flex gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSelectedSize(s.value)}
                    className={`px-5 py-2.5 rounded-xl text-sm transition-all min-h-[44px] ${
                      selectedSize === s.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-24">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-md border-t border-border/50">
        <div className="max-w-lg mx-auto flex">
          {navItems.map((item) => {
            const isActive = item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}