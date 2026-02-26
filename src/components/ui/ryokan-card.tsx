import { type ReactNode } from "react";
import { WafuButton } from "./wafu-button";

type RyokanCardVariant = "default" | "featured";

interface RyokanCardProps {
  roomName: string;
  roomType?: string;
  description: string;
  price: string;
  priceUnit?: string;
  imageSrc?: string;
  variant?: RyokanCardVariant;
  ctaLabel?: string;
  onCtaClick?: () => void;
  children?: ReactNode;
}

export function RyokanCard({
  roomName,
  roomType = "客室",
  description,
  price,
  priceUnit = "/ 一泊",
  imageSrc,
  variant = "default",
  ctaLabel = "予約する",
  onCtaClick,
  children,
}: RyokanCardProps) {
  const isFeatured = variant === "featured";

  return (
    <div
      className={[
        "rounded-sm border overflow-hidden",
        "transition-shadow duration-300",
        isFeatured
          ? "border-wafu-kohaku shadow-md"
          : "border-wafu-border hover:shadow-sm",
        "bg-wafu-bg-card",
      ].join(" ")}
    >
      {/* Image Area */}
      <div className="relative h-48 bg-wafu-bg-warm overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={roomName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-wafu-text-muted text-sm">
            {roomName}
          </div>
        )}
        {isFeatured && (
          <span className="absolute top-3 right-3 bg-wafu-kohaku text-white text-xs font-semibold px-2 py-1 rounded-sm">
            おすすめ
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <span className="text-xs font-semibold tracking-widest text-wafu-momiji uppercase">
          {roomType}
        </span>
        <h3 className="font-serif-jp text-xl font-semibold text-wafu-text-primary">
          {roomName}
        </h3>
        <p className="text-sm text-wafu-text-secondary leading-relaxed">
          {description}
        </p>

        {children}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-wafu-border">
          <div>
            <span className="font-serif-jp text-lg font-semibold text-wafu-text-primary">
              {price}
            </span>
            <span className="text-xs text-wafu-text-muted ml-1">
              {priceUnit}
            </span>
          </div>
          <WafuButton size="sm" onClick={onCtaClick}>
            {ctaLabel}
          </WafuButton>
        </div>
      </div>
    </div>
  );
}
