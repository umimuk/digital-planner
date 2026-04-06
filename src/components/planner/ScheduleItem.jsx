import { Heart, Star, Flower2, Cake, Briefcase, BookOpen, Music, Coffee } from "lucide-react";

const ICON_MAP = {
  heart: Heart,
  star: Star,
  flower: Flower2,
  cake: Cake,
  briefcase: Briefcase,
  book: BookOpen,
  music: Music,
  coffee: Coffee,
};

const COLOR_MAP = {
  pink: { bg: "bg-planner-pink/20", border: "border-planner-pink", text: "text-planner-pink" },
  lavender: { bg: "bg-planner-lavender/20", border: "border-planner-lavender", text: "text-planner-lavender" },
  mint: { bg: "bg-planner-mint/20", border: "border-planner-mint", text: "text-planner-mint" },
  peach: { bg: "bg-planner-peach/20", border: "border-planner-peach", text: "text-planner-peach" },
  sky: { bg: "bg-planner-sky/20", border: "border-planner-sky", text: "text-planner-sky" },
};

export default function ScheduleItem({ schedule, onClick }) {
  const IconComponent = ICON_MAP[schedule.icon] || Heart;
  const colors = COLOR_MAP[schedule.color] || COLOR_MAP.pink;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border-l-4 ${colors.border} ${colors.bg} hover:opacity-90 transition-all active:scale-[0.98]`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
          <IconComponent className={`w-4 h-4 ${colors.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{schedule.title}</p>
          {(schedule.start_time || schedule.end_time) && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {schedule.start_time || ""}
              {schedule.start_time && schedule.end_time ? " ~ " : ""}
              {schedule.end_time || ""}
            </p>
          )}
        </div>
      </div>
      {schedule.memo && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-1 pl-[42px]">{schedule.memo}</p>
      )}
    </button>
  );
}