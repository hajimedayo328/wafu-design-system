/**
 * WafuDivider - Snapshot テスト
 *
 * 3バリアント（line / dots / wave）でHTML構造が全く異なるため、
 * 全てのスナップショットを取る。
 * - line: <hr> タグ
 * - dots: <div> + 複数の <span>
 * - wave: <div> + テキスト装飾
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { WafuDivider } from "../wafu-divider";

afterEach(() => {
  cleanup();
});

describe("WafuDivider Snapshots", () => {
  it("デフォルト（line）のHTML構造", () => {
    const { container } = render(<WafuDivider />);
    expect(container.innerHTML).toMatchSnapshot();
  });

  it.each([["line"], ["dots"], ["wave"]] as const)(
    "variant=%s のHTML構造",
    (variant) => {
      const { container } = render(<WafuDivider variant={variant} />);
      expect(container.innerHTML).toMatchSnapshot();
    }
  );

  it("カスタム className 付き", () => {
    const { container } = render(<WafuDivider className="my-divider" />);
    expect(container.innerHTML).toMatchSnapshot();
  });
});
