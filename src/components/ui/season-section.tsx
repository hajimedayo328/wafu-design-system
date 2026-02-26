import { type ReactNode } from "react";

type Season = "spring" | "summer" | "autumn" | "winter";

interface SeasonSectionProps {
  season: Season;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

const seasonConfig: Record<Season, {
  bg: string;
  accent: string;
  icon: string;
  borderColor: string;
}> = {
  spring: {
    bg: "bg-pink-50",
    accent: "text-pink-600",
    icon: "🌸",
    borderColor: "border-pink-200",
  },
  summer: {
    bg: "bg-emerald-50",
    accent: "text-wafu-take",
    icon: "🎋",
    borderColor: "border-emerald-200",
  },
  autumn: {
    bg: "bg-orange-50",
    accent: "text-wafu-momiji",
    icon: "🍁",
    borderColor: "border-orange-200",
  },
  winter: {
    bg: "bg-slate-50",
    accent: "text-wafu-ai",
    icon: "❄️",
    borderColor: "border-slate-200",
  },
};

const seasonLabel: Record<Season, string> = {
  spring: "春 — Spring",
  summer: "夏 — Summer",
  autumn: "秋 — Autumn",
  winter: "冬 — Winter",
};

export function SeasonSection({
  season,
  title,
  subtitle,
  children,
  className = "",
}: SeasonSectionProps) {
  const config = seasonConfig[season];

  return (
    <section
      aria-label={title}
      className={[
        "rounded-sm border p-8",
        config.bg,
        config.borderColor,
        className,
      ].join(" ")}
    >
      {/* Season Label */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl" role="img" aria-label={season}>
          {config.icon}
        </span>
        <span className={["text-xs font-semibold tracking-widest uppercase", config.accent].join(" ")}>
          {seasonLabel[season]}
        </span>
      </div>

      {/* Title */}
      <h2 className="font-serif-jp text-2xl font-bold text-wafu-text-primary mb-2">
        {title}
      </h2>

      {subtitle && (
        <p className="text-sm text-wafu-text-secondary leading-relaxed mb-6">
          {subtitle}
        </p>
      )}

      {/* Content */}
      {children && <div className="mt-6">{children}</div>}
    </section>
  );
}
