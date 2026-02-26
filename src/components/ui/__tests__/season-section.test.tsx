import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SeasonSection } from "../season-section";

afterEach(() => {
  cleanup();
});

describe("SeasonSection", () => {
  it("renders title as heading", () => {
    render(<SeasonSection season="spring" title="桜の季節" />);
    expect(screen.getByRole("heading", { name: "桜の季節" })).toBeDefined();
  });

  it("renders subtitle when provided", () => {
    render(
      <SeasonSection season="spring" title="桜の季節" subtitle="春の旅館" />,
    );
    expect(screen.getByText("春の旅館")).toBeDefined();
  });

  it("does not render subtitle when not provided", () => {
    render(<SeasonSection season="spring" title="桜の季節" />);
    expect(screen.queryByText("春の旅館")).toBeNull();
  });

  it("renders season label for spring", () => {
    render(<SeasonSection season="spring" title="Test" />);
    expect(screen.getByText("春 — Spring")).toBeDefined();
  });

  it("renders season label for summer", () => {
    render(<SeasonSection season="summer" title="Test" />);
    expect(screen.getByText("夏 — Summer")).toBeDefined();
  });

  it("renders season label for autumn", () => {
    render(<SeasonSection season="autumn" title="Test" />);
    expect(screen.getByText("秋 — Autumn")).toBeDefined();
  });

  it("renders season label for winter", () => {
    render(<SeasonSection season="winter" title="Test" />);
    expect(screen.getByText("冬 — Winter")).toBeDefined();
  });

  it("renders children content", () => {
    render(
      <SeasonSection season="autumn" title="紅葉狩り">
        <p>紅葉の見どころ</p>
      </SeasonSection>,
    );
    expect(screen.getByText("紅葉の見どころ")).toBeDefined();
  });

  it("has accessible section element with aria-label", () => {
    render(<SeasonSection season="winter" title="雪見の宿" />);
    const section = screen.getByRole("region", { name: "雪見の宿" });
    expect(section).toBeDefined();
  });

  it("has emoji icon with aria-label", () => {
    render(<SeasonSection season="spring" title="Test" />);
    expect(screen.getByLabelText("spring")).toBeDefined();
  });
});
