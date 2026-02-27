/**
 * WafuButton - Edge Case テスト
 *
 * 目的: 「壊そうとしても壊れない」ことを証明する
 *
 * 普通の使い方はUnitテストで確認済み。
 * ここでは「ユーザーが想定外の使い方をしたらどうなる？」を検証する。
 *
 * Edge Case（エッジケース）= 境界値、異常値、極端な入力
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { WafuButton } from "../wafu-button";

afterEach(() => {
  cleanup();
});

// ============================================
// 1. 空・極端な children
//    → ボタンの中身が普通じゃないとき
// ============================================
describe("Edge: 極端な children", () => {
  it("空文字でもクラッシュしない", () => {
    render(<WafuButton>{""}</WafuButton>);
    const button = screen.getByRole("button");
    expect(button).toBeDefined();
  });

  it("超長文テキストでもレンダリングできる", () => {
    const longText = "予約".repeat(1000); // 2000文字
    render(<WafuButton>{longText}</WafuButton>);
    const button = screen.getByRole("button");
    expect(button.textContent).toContain("予約");
  });

  it("特殊文字（絵文字・記号）が表示される", () => {
    render(<WafuButton>🎋 予約 &amp; 確認 &lt;OK&gt;</WafuButton>);
    expect(screen.getByText(/🎋/)).toBeDefined();
  });

  it("数字だけでもレンダリングできる", () => {
    render(<WafuButton>{12345}</WafuButton>);
    expect(screen.getByText("12345")).toBeDefined();
  });

  it("ネストした複雑なJSXでも壊れない", () => {
    render(
      <WafuButton>
        <span>
          <strong>太字</strong>と<em>斜体</em>
        </span>
      </WafuButton>
    );
    expect(screen.getByText("太字")).toBeDefined();
    expect(screen.getByText("斜体")).toBeDefined();
  });
});

// ============================================
// 2. props の組み合わせ爆発
//    → 複数のpropsを同時に渡したとき矛盾しないか
// ============================================
describe("Edge: props の組み合わせ", () => {
  it("全propsを同時に渡しても壊れない", () => {
    const handleClick = vi.fn();
    render(
      <WafuButton
        variant="momiji"
        size="lg"
        disabled
        className="extra"
        aria-label="テスト"
        type="submit"
        onClick={handleClick}
      >
        全部盛り
      </WafuButton>
    );
    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.className).toContain("bg-wafu-momiji");
    expect(button.className).toContain("px-7");
    expect(button.className).toContain("extra");
    expect(button.disabled).toBe(true);
    expect(button.type).toBe("submit");
  });

  it("variant + size の全組み合わせ（18パターン）が壊れない", () => {
    const variants = ["ai", "momiji", "kohaku", "take", "ghost", "outline"] as const;
    const sizes = ["sm", "md", "lg"] as const;

    for (const variant of variants) {
      for (const size of sizes) {
        cleanup();
        render(
          <WafuButton variant={variant} size={size}>
            {variant}-{size}
          </WafuButton>
        );
        const button = screen.getByRole("button");
        // クラッシュしないこと + テキストが表示されること
        expect(button.textContent).toBe(`${variant}-${size}`);
      }
    }
  });
});

// ============================================
// 3. className の競合
//    → ユーザーが上書きしようとしたとき
// ============================================
describe("Edge: className の競合", () => {
  it("ユーザーが背景色を上書きしようとしても、両方のクラスが存在する", () => {
    // ユーザーが独自の bg-red-500 を渡した場合
    render(<WafuButton className="bg-red-500">Test</WafuButton>);
    const button = screen.getByRole("button");
    // 両方存在する（CSS の優先度は Tailwind が決める）
    expect(button.className).toContain("bg-wafu-ai");
    expect(button.className).toContain("bg-red-500");
  });

  it("空の className でも壊れない", () => {
    render(<WafuButton className="">Test</WafuButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-wafu-ai");
  });

  it("スペースだけの className でも壊れない", () => {
    render(<WafuButton className="   ">Test</WafuButton>);
    const button = screen.getByRole("button");
    expect(button).toBeDefined();
  });
});

// ============================================
// 4. 連続操作
//    → 何度もクリックしたらどうなる？
// ============================================
describe("Edge: 連続操作", () => {
  it("100回連続クリックしても全部発火する", () => {
    const handleClick = vi.fn();
    render(<WafuButton onClick={handleClick}>Click</WafuButton>);
    const button = screen.getByRole("button");

    for (let i = 0; i < 100; i++) {
      fireEvent.click(button);
    }
    expect(handleClick).toHaveBeenCalledTimes(100);
  });

  it("onDoubleClick ハンドラが動く", () => {
    const handleDblClick = vi.fn();
    render(<WafuButton onDoubleClick={handleDblClick}>Click</WafuButton>);
    const button = screen.getByRole("button");
    fireEvent.doubleClick(button);
    // jsdom では doubleClick は dblclick イベントだけ発火する
    // （実ブラウザでは click×2 + dblclick だが、テスト環境では異なる）
    expect(handleDblClick).toHaveBeenCalledOnce();
  });
});

// ============================================
// 5. イベントハンドラの透過
//    → onClick以外のイベントも正しく動くか
// ============================================
describe("Edge: イベントハンドラの透過", () => {
  it("onMouseEnter / onMouseLeave が動く", () => {
    const onEnter = vi.fn();
    const onLeave = vi.fn();
    render(
      <WafuButton onMouseEnter={onEnter} onMouseLeave={onLeave}>
        Hover
      </WafuButton>
    );
    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);
    expect(onEnter).toHaveBeenCalledOnce();
    expect(onLeave).toHaveBeenCalledOnce();
  });

  it("onFocus / onBlur が動く", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(
      <WafuButton onFocus={onFocus} onBlur={onBlur}>
        Focus
      </WafuButton>
    );
    const button = screen.getByRole("button");
    fireEvent.focus(button);
    fireEvent.blur(button);
    expect(onFocus).toHaveBeenCalledOnce();
    expect(onBlur).toHaveBeenCalledOnce();
  });
});
