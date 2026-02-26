type WafuDividerVariant = "line" | "dots" | "wave";

interface WafuDividerProps {
  variant?: WafuDividerVariant;
  className?: string;
}

export function WafuDivider({
  variant = "line",
  className = "",
}: WafuDividerProps) {
  if (variant === "dots") {
    return (
      <div
        role="separator"
        className={["flex items-center justify-center gap-3 py-6", className].join(" ")}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-wafu-border-strong" />
        <span className="w-2 h-2 rounded-full bg-wafu-momiji" />
        <span className="w-1.5 h-1.5 rounded-full bg-wafu-border-strong" />
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div
        role="separator"
        className={["flex items-center justify-center py-6", className].join(" ")}
      >
        <span className="text-wafu-text-muted text-xl tracking-[0.5em]">
          〜〜〜
        </span>
      </div>
    );
  }

  return (
    <hr
      className={[
        "border-t border-wafu-border my-8",
        className,
      ].join(" ")}
    />
  );
}
