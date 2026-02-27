/**
 * WafuDivider - Edge Case テスト
 *
 * 目的: 「壊そうとしても壊れない」ことを証明する
 *
 * 普通の使い方は wafu-divider.test.tsx で確認済み。
 * ここでは「実装者が想定していない使い方をしたらどうなる？」を検証する。
 *
 * Edge Case（エッジケース）= 全バリアント、className 透過、aria 属性、組み合わせ
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { WafuDivider } from "../wafu-divider";

afterEach(() => {
  cleanup();
});

// ============================================
// 1. 3バリアント全テスト
//    → line / dots / wave の3バリアント全てで role=separator が付くかを確認する
//    → それぞれ異なる HTML 要素（hr / div / div）を使うため、全パターンを明示的に検証する
// ============================================
describe("Edge: 3バリアント全てのレンダリング", () => {
  it("variant=line: hr 要素として描画される", () => {
    // line は唯一 hr タグを使う。セマンティクスが正しいか確認する
    render(<WafuDivider variant="line" />);
    const sep = screen.getByRole("separator");
    expect(sep.tagName.toLowerCase()).toBe("hr");
  });

  it("variant=dots: div 要素として描画される", () => {
    render(<WafuDivider variant="dots" />);
    const sep = screen.getByRole("separator");
    expect(sep.tagName.toLowerCase()).toBe("div");
  });

  it("variant=wave: div 要素として描画される", () => {
    render(<WafuDivider variant="wave" />);
    const sep = screen.getByRole("separator");
    expect(sep.tagName.toLowerCase()).toBe("div");
  });

  it("variant を省略した場合はデフォルト line になる", () => {
    // デフォルト値が line であることを確認する（仕様の変更検知）
    render(<WafuDivider />);
    const sep = screen.getByRole("separator");
    expect(sep.tagName.toLowerCase()).toBe("hr");
  });

  it("variant=dots: 3つのドット要素が描画される", () => {
    // dots は span を3つ並べる。DOM 上で確認する
    render(<WafuDivider variant="dots" />);
    const sep = screen.getByRole("separator");
    const dots = sep.querySelectorAll("span");
    expect(dots.length).toBe(3);
  });

  it("variant=wave: 波紋テキスト（〜〜〜）が表示される", () => {
    // wave は「〜〜〜」テキストを表示する。コンテンツの確認
    render(<WafuDivider variant="wave" />);
    expect(screen.getByText("〜〜〜")).toBeDefined();
  });

  it("3バリアント全てで role=separator が設定されている", () => {
    // スクリーンリーダーがセパレーターとして読み上げられるか
    const variants = ["line", "dots", "wave"] as const;
    for (const variant of variants) {
      cleanup();
      render(<WafuDivider variant={variant} />);
      expect(screen.getByRole("separator")).toBeDefined();
    }
  });
});
// ============================================
// 2. className の透過
//    → ユーザーが独自クラスを渡したとき、内部クラスと共存するかを確認する
//    → 空文字・スペースのみでもクラッシュしないことを確認する
//    → 3バリアント全てで className が正しく付与されるかを確認する
// ============================================
describe("Edge: className の透過", () => {
  it("line: 独自 className がベースクラスと共存する", () => {
    render(<WafuDivider variant="line" className="my-divider" />);
    const sep = screen.getByRole("separator");
    // 内部のボーダークラスと渡した my-divider が両立する
    expect(sep.className).toContain("border-wafu-border");
    expect(sep.className).toContain("my-divider");
  });

  it("dots: 独自 className がベースクラスと共存する", () => {
    render(<WafuDivider variant="dots" className="my-dots" />);
    const sep = screen.getByRole("separator");
    expect(sep.className).toContain("flex");
    expect(sep.className).toContain("my-dots");
  });

  it("wave: 独自 className がベースクラスと共存する", () => {
    render(<WafuDivider variant="wave" className="my-wave" />);
    const sep = screen.getByRole("separator");
    expect(sep.className).toContain("flex");
    expect(sep.className).toContain("my-wave");
  });

  it("空の className でもクラッシュしない（line）", () => {
    render(<WafuDivider variant="line" className="" />);
    expect(screen.getByRole("separator")).toBeDefined();
  });

  it("空の className でもクラッシュしない（dots）", () => {
    render(<WafuDivider variant="dots" className="" />);
    expect(screen.getByRole("separator")).toBeDefined();
  });

  it("空の className でもクラッシュしない（wave）", () => {
    render(<WafuDivider variant="wave" className="" />);
    expect(screen.getByRole("separator")).toBeDefined();
  });

  it("スペースのみの className でもクラッシュしない", () => {
    render(<WafuDivider className="   " />);
    expect(screen.getByRole("separator")).toBeDefined();
  });

  it("複数クラスを渡しても全て付与される", () => {
    render(<WafuDivider className="class-a class-b class-c" />);
    const sep = screen.getByRole("separator");
    expect(sep.className).toContain("class-a");
    expect(sep.className).toContain("class-b");
    expect(sep.className).toContain("class-c");
  });
});
// ============================================
// 3. role=separator の確認
//    → ARIA ロールとして separator が正しく設定されているかを確認する
//    → hr タグは暗黙の separator ロールを持つが、div は明示的な role 指定が必要
//    → アクセシビリティ上、スクリーンリーダーが「区切り線」として認識できるかを保証する
// ============================================
describe("Edge: role=separator の堅牢性", () => {
  it("line: hr タグは暗黙の separator ロールを持つ", () => {
    // hr タグは WAI-ARIA で separator ロールを持つため、明示的な role 属性は不要
    render(<WafuDivider variant="line" />);
    const sep = screen.getByRole("separator");
    // hr タグ自体の role 属性は設定されていないことを確認（暗黙のロール依存）
    expect(sep.getAttribute("role")).toBeNull();
  });

  it("dots: div タグに role=separator が明示的に設定されている", () => {
    // div は暗黙の separator ロールを持たないため、明示的な role が必要
    render(<WafuDivider variant="dots" />);
    const sep = screen.getByRole("separator");
    expect(sep.getAttribute("role")).toBe("separator");
  });

  it("wave: div タグに role=separator が明示的に設定されている", () => {
    render(<WafuDivider variant="wave" />);
    const sep = screen.getByRole("separator");
    expect(sep.getAttribute("role")).toBe("separator");
  });
});

// ============================================
// 4. aria 属性の補足確認
//    → WafuDividerProps は variant/className のみを受け付ける型定義であり、
//      aria-* は現在の型では透過されない。
//    → ここでは role=separator の存在確認と、
//      hr タグの aria 上の扱いを確認する
// ============================================
describe("Edge: aria 属性の補足確認", () => {
  it("line: hr タグは role=separator として認識され aria-label なしで動作する", () => {
    // WafuDividerProps は aria-label を受け付けないため、デフォルト状態での確認
    render(<WafuDivider variant="line" />);
    expect(screen.getByRole("separator")).toBeDefined();
  });

  it("dots: role=separator が div に明示設定されスクリーンリーダー対応できる", () => {
    render(<WafuDivider variant="dots" />);
    const sep = screen.getByRole("separator");
    // div への明示的な role 付与により、スクリーンリーダーが認識できる
    expect(sep.getAttribute("role")).toBe("separator");
  });

  it("wave: role=separator が div に明示設定されスクリーンリーダー対応できる", () => {
    render(<WafuDivider variant="wave" />);
    const sep = screen.getByRole("separator");
    expect(sep.getAttribute("role")).toBe("separator");
  });
});
// ============================================
// 5. バリアント × className の全組み合わせ
//    → 3バリアント × 代表的な className パターンの組み合わせがクラッシュしないか
//    → デザインシステムとして予測可能な動作を保証する
// ============================================
describe("Edge: バリアント × className の全組み合わせ", () => {
  it("全バリアント × 代表的 className パターンが全てクラッシュしない", () => {
    const variants = ["line", "dots", "wave"] as const;
    const classNames = ["my-class", "", "   ", "a b c"];

    for (const variant of variants) {
      for (const cls of classNames) {
        cleanup();
        expect(() => {
          render(<WafuDivider variant={variant} className={cls} />);
        }).not.toThrow();
      }
    }
  });

  it("全バリアントで role=separator が常に存在する", () => {
    // className や aria-* を追加しても role が失われないことを確認する
    const variants = ["line", "dots", "wave"] as const;
    for (const variant of variants) {
      cleanup();
      render(<WafuDivider variant={variant} className="extra" />);
      expect(screen.getByRole("separator")).toBeDefined();
    }
  });
});
