/**
 * WafuFadeIn - Snapshot テスト
 *
 * アニメーション方向ごとに初期状態のHTML（opacity-0 + translate）を記録する。
 * IntersectionObserver のモックは不要。初期レンダリング状態だけを撮る。
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { WafuFadeIn } from "../wafu-fade-in";

afterEach(() => {
  cleanup();
});

describe("WafuFadeIn Snapshots", () => {
  // 5方向全ての初期状態
  it.each([
    ["up"],
    ["down"],
    ["left"],
    ["right"],
    ["none"],
  ] as const)("direction=%s の初期HTML構造", (direction) => {
    const { container } = render(
      <WafuFadeIn direction={direction}>テスト</WafuFadeIn>
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("カスタム delay + duration", () => {
    const { container } = render(
      <WafuFadeIn delay={200} duration={1000}>テスト</WafuFadeIn>
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("カスタム className 付き", () => {
    const { container } = render(
      <WafuFadeIn className="my-custom">テスト</WafuFadeIn>
    );
    expect(container.innerHTML).toMatchSnapshot();
  });
});
