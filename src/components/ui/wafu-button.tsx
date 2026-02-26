import { type ButtonHTMLAttributes, type ReactNode } from "react";

type WafuButtonVariant = "ai" | "momiji" | "kohaku" | "take" | "ghost" | "outline";
type WafuButtonSize = "sm" | "md" | "lg";

interface WafuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: WafuButtonVariant;
  size?: WafuButtonSize;
  children: ReactNode;
}

const variantStyles: Record<WafuButtonVariant, string> = {
  ai: "bg-wafu-ai text-wafu-text-inverse hover:bg-wafu-ai-dark",
  momiji: "bg-wafu-momiji text-wafu-text-inverse hover:bg-wafu-momiji-bright",
  kohaku: "bg-wafu-kohaku text-wafu-text-inverse hover:bg-wafu-kohaku-bright",
  take: "bg-wafu-take text-wafu-text-inverse hover:bg-wafu-take-light",
  ghost: "bg-transparent text-wafu-text-primary hover:bg-wafu-bg-warm",
  outline: "bg-transparent text-wafu-text-primary border border-wafu-border hover:border-wafu-border-strong hover:bg-wafu-bg-warm",
};

const sizeStyles: Record<WafuButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

export function WafuButton({
  variant = "ai",
  size = "md",
  children,
  className = "",
  disabled,
  ...props
}: WafuButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2",
        "font-medium rounded-sm",
        "transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wafu-ai",
        "disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
