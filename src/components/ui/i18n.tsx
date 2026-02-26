"use client";

import { createContext, useContext, type ReactNode } from "react";

export type WafuLocale = "ja" | "en";

interface WafuTranslations {
  booking: string;
  perNight: string;
  recommended: string;
  checkAvailability: string;
  seasons: {
    spring: string;
    summer: string;
    autumn: string;
    winter: string;
  };
}

const translations: Record<WafuLocale, WafuTranslations> = {
  ja: {
    booking: "予約する",
    perNight: "/ 一泊",
    recommended: "おすすめ",
    checkAvailability: "空室を確認",
    seasons: {
      spring: "春 — Spring",
      summer: "夏 — Summer",
      autumn: "秋 — Autumn",
      winter: "冬 — Winter",
    },
  },
  en: {
    booking: "Book Now",
    perNight: "/ night",
    recommended: "Recommended",
    checkAvailability: "Check Availability",
    seasons: {
      spring: "Spring — 春",
      summer: "Summer — 夏",
      autumn: "Autumn — 秋",
      winter: "Winter — 冬",
    },
  },
};

const WafuI18nContext = createContext<WafuLocale>("ja");

interface WafuI18nProviderProps {
  locale: WafuLocale;
  children: ReactNode;
}

export function WafuI18nProvider({ locale, children }: WafuI18nProviderProps) {
  return (
    <WafuI18nContext.Provider value={locale}>
      {children}
    </WafuI18nContext.Provider>
  );
}

export function useWafuLocale(): WafuLocale {
  return useContext(WafuI18nContext);
}

export function useWafuTranslations(): WafuTranslations {
  const locale = useContext(WafuI18nContext);
  return translations[locale];
}
