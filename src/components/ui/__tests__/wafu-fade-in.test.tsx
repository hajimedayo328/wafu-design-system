import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import { WafuFadeIn } from "../wafu-fade-in";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

let triggerIntersection: (() => void) | null = null;
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();

beforeEach(() => {
  triggerIntersection = null;
  mockObserve.mockClear();
  mockUnobserve.mockClear();

  vi.stubGlobal(
    "IntersectionObserver",
    class {
      private callback: IntersectionObserverCallback;
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        triggerIntersection = () => {
          this.callback(
            [{ isIntersecting: true } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
        };
      }
      observe = mockObserve;
      unobserve = mockUnobserve;
      disconnect = vi.fn();
    },
  );
});

function getWrapper(text: string): HTMLElement {
  const el = screen.getByText(text);
  // If text is direct child of the fade-in div, el IS the div
  // If text is wrapped in another element, el.closest might help
  // The fade-in div has transition-all class
  return el.closest("[class*='transition-all']") ?? el;
}

describe("WafuFadeIn", () => {
  it("renders children", () => {
    render(<WafuFadeIn>テストコンテンツ</WafuFadeIn>);
    expect(screen.getByText("テストコンテンツ")).toBeDefined();
  });

  it("starts with opacity-0 before intersection", () => {
    render(<WafuFadeIn>Hidden</WafuFadeIn>);
    const wrapper = getWrapper("Hidden");
    expect(wrapper.className).toContain("opacity-0");
  });

  it("becomes opacity-100 after intersection", () => {
    render(<WafuFadeIn>Visible</WafuFadeIn>);
    act(() => {
      triggerIntersection?.();
    });
    const wrapper = getWrapper("Visible");
    expect(wrapper.className).toContain("opacity-100");
  });

  it("applies translate-y-6 for up direction before visible", () => {
    render(<WafuFadeIn direction="up">Up</WafuFadeIn>);
    const wrapper = getWrapper("Up");
    expect(wrapper.className).toContain("translate-y-6");
  });

  it("applies translate-x-6 for left direction before visible", () => {
    render(<WafuFadeIn direction="left">Left</WafuFadeIn>);
    const wrapper = getWrapper("Left");
    expect(wrapper.className).toContain("translate-x-6");
  });

  it("applies custom duration via style", () => {
    render(<WafuFadeIn duration={1000}>Slow</WafuFadeIn>);
    const wrapper = getWrapper("Slow");
    expect((wrapper as HTMLElement).style.transitionDuration).toBe("1000ms");
  });

  it("applies custom delay via style", () => {
    render(<WafuFadeIn delay={500}>Delayed</WafuFadeIn>);
    const wrapper = getWrapper("Delayed");
    expect((wrapper as HTMLElement).style.transitionDelay).toBe("500ms");
  });

  it("observes the element", () => {
    render(<WafuFadeIn>Observed</WafuFadeIn>);
    expect(mockObserve).toHaveBeenCalledOnce();
  });
});
