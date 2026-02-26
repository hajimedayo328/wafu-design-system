import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { WafuButton } from "../wafu-button";

afterEach(() => {
  cleanup();
});

describe("WafuButton", () => {
  it("renders children text", () => {
    render(<WafuButton>予約する</WafuButton>);
    expect(screen.getByText("予約する")).toBeDefined();
  });

  it("applies ai variant by default", () => {
    render(<WafuButton>Test</WafuButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-wafu-ai");
  });

  it("applies momiji variant", () => {
    render(<WafuButton variant="momiji">Test</WafuButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-wafu-momiji");
  });

  it("applies size classes", () => {
    render(<WafuButton size="lg">Test</WafuButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("px-7");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<WafuButton onClick={handleClick}>Click</WafuButton>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled prop is true", () => {
    render(<WafuButton disabled>Test</WafuButton>);
    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("does not fire click when disabled", () => {
    const handleClick = vi.fn();
    render(<WafuButton disabled onClick={handleClick}>Test</WafuButton>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
