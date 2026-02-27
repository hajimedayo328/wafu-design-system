/**
 * WafuButton - Snapshot テスト
 *
 * 目的: HTML構造が意図せず変わったことを検出する
 *
 * 仕組み:
 * 1. 初回実行時: コンポーネントのHTMLを __snapshots__/ フォルダに保存
 * 2. 次回以降: 前回のHTMLと比較し、差分があれば失敗
 * 3. 意図的な変更なら `npx vitest -u` でスナップショットを更新
 *
 * これにより「見た目を変えるつもりなかったのに変わってた」を防ぐ
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { WafuButton } from "../wafu-button";

afterEach(() => {
  cleanup();
});

// ============================================
// 各バリアント × 各サイズのHTML構造を記録
// → クラス名の変更、タグの変更、属性の変更を全て検出
// ============================================
describe("WafuButton Snapshots", () => {
  // 6バリアント全てのスナップショット
  it.each([
    ["ai"],
    ["momiji"],
    ["kohaku"],
    ["take"],
    ["ghost"],
    ["outline"],
  ] as const)("variant=%s のHTML構造", (variant) => {
    const { container } = render(
      <WafuButton variant={variant}>テスト</WafuButton>
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  // 3サイズ全てのスナップショット
  it.each([["sm"], ["md"], ["lg"]] as const)(
    "size=%s のHTML構造",
    (size) => {
      const { container } = render(
        <WafuButton size={size}>テスト</WafuButton>
      );
      expect(container.innerHTML).toMatchSnapshot();
    }
  );

  // 特殊状態
  it("disabled 状態のHTML構造", () => {
    const { container } = render(<WafuButton disabled>テスト</WafuButton>);
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("カスタム className 付きのHTML構造", () => {
    const { container } = render(
      <WafuButton className="custom-class">テスト</WafuButton>
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("aria-label 付きのHTML構造", () => {
    const { container } = render(
      <WafuButton aria-label="予約ボタン">テスト</WafuButton>
    );
    expect(container.innerHTML).toMatchSnapshot();
  });
});
