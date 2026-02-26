import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { WafuDivider } from "../wafu-divider";

afterEach(() => {
  cleanup();
});

describe("WafuDivider", () => {
  it("renders line variant as hr by default", () => {
    render(<WafuDivider />);
    expect(screen.getByRole("separator")).toBeDefined();
  });

  it("renders dots variant with separator role", () => {
    render(<WafuDivider variant="dots" />);
    expect(screen.getByRole("separator")).toBeDefined();
  });

  it("renders wave variant with separator role", () => {
    render(<WafuDivider variant="wave" />);
    expect(screen.getByRole("separator")).toBeDefined();
  });

  it("renders wave text content", () => {
    render(<WafuDivider variant="wave" />);
    expect(screen.getByText("〜〜〜")).toBeDefined();
  });

  it("applies custom className", () => {
    render(<WafuDivider className="my-custom-class" />);
    const separator = screen.getByRole("separator");
    expect(separator.className).toContain("my-custom-class");
  });
});
