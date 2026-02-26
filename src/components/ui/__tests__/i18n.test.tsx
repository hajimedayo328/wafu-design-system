import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { WafuI18nProvider, useWafuTranslations } from "../i18n";
import { RyokanCard } from "../ryokan-card";
import { SeasonSection } from "../season-section";

afterEach(() => {
  cleanup();
});

function TranslationDisplay() {
  const t = useWafuTranslations();
  return <div data-testid="booking">{t.booking}</div>;
}

describe("WafuI18nProvider", () => {
  it("defaults to Japanese", () => {
    render(<TranslationDisplay />);
    expect(screen.getByTestId("booking").textContent).toBe("予約する");
  });

  it("switches to English", () => {
    render(
      <WafuI18nProvider locale="en">
        <TranslationDisplay />
      </WafuI18nProvider>,
    );
    expect(screen.getByTestId("booking").textContent).toBe("Book Now");
  });
});

describe("RyokanCard i18n", () => {
  const defaultProps = {
    roomName: "紅葉の間",
    description: "テスト",
    price: "¥48,000",
  };

  it("shows Japanese CTA by default", () => {
    render(<RyokanCard {...defaultProps} />);
    expect(screen.getByRole("button", { name: "予約する" })).toBeDefined();
  });

  it("shows English CTA in en locale", () => {
    render(
      <WafuI18nProvider locale="en">
        <RyokanCard {...defaultProps} />
      </WafuI18nProvider>,
    );
    expect(screen.getByRole("button", { name: "Book Now" })).toBeDefined();
  });

  it("shows English price unit in en locale", () => {
    render(
      <WafuI18nProvider locale="en">
        <RyokanCard {...defaultProps} />
      </WafuI18nProvider>,
    );
    expect(screen.getByText("/ night")).toBeDefined();
  });

  it("shows English recommended badge in en locale", () => {
    render(
      <WafuI18nProvider locale="en">
        <RyokanCard {...defaultProps} variant="featured" />
      </WafuI18nProvider>,
    );
    expect(screen.getByText("Recommended")).toBeDefined();
  });
});

describe("SeasonSection i18n", () => {
  it("shows Japanese season label by default", () => {
    render(<SeasonSection season="spring" title="テスト" />);
    expect(screen.getByText("春 — Spring")).toBeDefined();
  });

  it("shows English season label in en locale", () => {
    render(
      <WafuI18nProvider locale="en">
        <SeasonSection season="spring" title="テスト" />
      </WafuI18nProvider>,
    );
    expect(screen.getByText("Spring — 春")).toBeDefined();
  });
});
