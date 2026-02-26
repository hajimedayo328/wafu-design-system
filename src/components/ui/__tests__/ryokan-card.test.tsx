import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { RyokanCard } from "../ryokan-card";

afterEach(() => {
  cleanup();
});

describe("RyokanCard", () => {
  const defaultProps = {
    roomName: "紅葉の間",
    roomType: "特別室",
    description: "四季折々の庭園を望む特別室。",
    price: "¥48,000",
  };

  it("renders room name as heading", () => {
    render(<RyokanCard {...defaultProps} />);
    expect(screen.getByRole("heading", { name: "紅葉の間" })).toBeDefined();
  });

  it("renders room type", () => {
    render(<RyokanCard {...defaultProps} />);
    expect(screen.getByText("特別室")).toBeDefined();
  });

  it("renders price", () => {
    render(<RyokanCard {...defaultProps} />);
    expect(screen.getByText("¥48,000")).toBeDefined();
  });

  it("renders default CTA label", () => {
    render(<RyokanCard {...defaultProps} />);
    expect(screen.getByRole("button", { name: "予約する" })).toBeDefined();
  });

  it("renders custom CTA label", () => {
    render(<RyokanCard {...defaultProps} ctaLabel="空室を確認" />);
    expect(screen.getByRole("button", { name: "空室を確認" })).toBeDefined();
  });

  it("shows おすすめ badge when featured", () => {
    render(<RyokanCard {...defaultProps} variant="featured" />);
    expect(screen.getByText("おすすめ")).toBeDefined();
  });

  it("does not show badge when default variant", () => {
    render(<RyokanCard {...defaultProps} />);
    expect(screen.queryByText("おすすめ")).toBeNull();
  });

  it("calls onCtaClick when CTA is clicked", () => {
    const handleClick = vi.fn();
    render(<RyokanCard {...defaultProps} onCtaClick={handleClick} />);
    fireEvent.click(screen.getByRole("button", { name: "予約する" }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("has accessible article element with aria-label", () => {
    render(<RyokanCard {...defaultProps} />);
    const article = screen.getByRole("article", { name: "紅葉の間" });
    expect(article).toBeDefined();
  });
});
