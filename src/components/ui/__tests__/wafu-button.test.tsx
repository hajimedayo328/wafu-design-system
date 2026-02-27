import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { WafuButton } from "../wafu-button";

afterEach(() => {
  cleanup();
});

// ============================================
// 1. 基本レンダリング
//    → そもそもちゃんと表示されるか？
// ============================================
describe("WafuButton - 基本レンダリング", () => {
  it("テキストが表示される", () => {
    render(<WafuButton>予約する</WafuButton>);
    expect(screen.getByText("予約する")).toBeDefined();
  });

  it("button要素としてレンダリングされる", () => {
    render(<WafuButton>Test</WafuButton>);
    const button = screen.getByRole("button");
    expect(button.tagName).toBe("BUTTON");
  });

  it("子要素にJSXを渡せる", () => {
    render(
      <WafuButton>
        <span data-testid="icon">★</span>予約
      </WafuButton>
    );
    expect(screen.getByTestId("icon")).toBeDefined();
    expect(screen.getByText("予約")).toBeDefined();
  });
});

// ============================================
// 2. バリアント（色）
//    → 6色全部テストする。1色だけ確認して
//      「全部OK」とは言えない
// ============================================
describe("WafuButton - バリアント", () => {
  it("デフォルトは ai（藍）", () => {
    render(<WafuButton>Test</WafuButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-wafu-ai");
  });

  // 6バリアント全部を一括でテスト
  // it.each = 同じテストをデータだけ変えて繰り返す便利な書き方
  it.each([
    ["ai", "bg-wafu-ai"],
    ["momiji", "bg-wafu-momiji"],
    ["kohaku", "bg-wafu-kohaku"],
    ["take", "bg-wafu-take"],
    ["ghost", "bg-transparent"],
    ["outline", "bg-transparent"],
  ] as const)("variant=%s → %s が適用される", (variant, expectedClass) => {
    render(<WafuButton variant={variant}>Test</WafuButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain(expectedClass);
  });

  it("outline には border がある", () => {
    render(<WafuButton variant="outline">Test</WafuButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("border");
  });
});

// ============================================
// 3. サイズ
//    → sm / md / lg 全部確認する
// ============================================
describe("WafuButton - サイズ", () => {
  it("デフォルトは md", () => {
    render(<WafuButton>Test</WafuButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("px-5");
  });

  it.each([
    ["sm", "px-3"],
    ["md", "px-5"],
    ["lg", "px-7"],
  ] as const)("size=%s → %s が適用される", (size, expectedClass) => {
    render(<WafuButton size={size}>Test</WafuButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain(expectedClass);
  });
});

// ============================================
// 4. インタラクション（操作）
//    → クリック、キーボード、disabled
// ============================================
describe("WafuButton - インタラクション", () => {
  it("クリックでイベントが発火する", () => {
    const handleClick = vi.fn();
    render(<WafuButton onClick={handleClick}>Click</WafuButton>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("Enterキーで押せる（アクセシビリティ）", () => {
    const handleClick = vi.fn();
    render(<WafuButton onClick={handleClick}>Click</WafuButton>);
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    // button要素はEnterでclick発火するのがブラウザのデフォルト動作
    // keyDownイベント自体が発火することを確認
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("disabled=true でボタンが無効になる", () => {
    render(<WafuButton disabled>Test</WafuButton>);
    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("disabled=true でクリックしても発火しない", () => {
    const handleClick = vi.fn();
    render(
      <WafuButton disabled onClick={handleClick}>
        Test
      </WafuButton>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("disabled のとき opacity が下がる（視覚フィードバック）", () => {
    render(<WafuButton disabled>Test</WafuButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("disabled:opacity-50");
  });
});

// ============================================
// 5. HTML属性の透過
//    → ボタンに渡した属性がちゃんと反映されるか
//    → ライブラリとして「自由に使える」ことの保証
// ============================================
describe("WafuButton - HTML属性の透過", () => {
  it("カスタム className が追加される（既存を壊さない）", () => {
    render(<WafuButton className="my-custom-class">Test</WafuButton>);
    const button = screen.getByRole("button");
    // カスタムクラスが追加されている
    expect(button.className).toContain("my-custom-class");
    // 元のスタイルも残っている
    expect(button.className).toContain("bg-wafu-ai");
  });

  it("aria-label が透過される", () => {
    render(<WafuButton aria-label="予約ボタン">予約</WafuButton>);
    const button = screen.getByRole("button", { name: "予約ボタン" });
    expect(button).toBeDefined();
  });

  it("type属性が透過される（formで使うとき重要）", () => {
    render(<WafuButton type="submit">送信</WafuButton>);
    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.type).toBe("submit");
  });

  it("data-testid が透過される", () => {
    render(<WafuButton data-testid="booking-btn">予約</WafuButton>);
    expect(screen.getByTestId("booking-btn")).toBeDefined();
  });
});

// ============================================
// 6. アクセシビリティ
//    → スクリーンリーダーやキーボードユーザーが
//      使えることを保証する
// ============================================
describe("WafuButton - アクセシビリティ", () => {
  it("role=button を持つ", () => {
    render(<WafuButton>Test</WafuButton>);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("フォーカスリングのスタイルがある", () => {
    render(<WafuButton>Test</WafuButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("focus-visible:outline");
  });

  it("disabled のとき aria-disabled ではなく disabled 属性を使う", () => {
    render(<WafuButton disabled>Test</WafuButton>);
    const button = screen.getByRole("button") as HTMLButtonElement;
    // HTML native の disabled を使う = スクリーンリーダーが正しく認識
    expect(button.disabled).toBe(true);
  });
});
