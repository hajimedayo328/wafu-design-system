/**
 * WafuFadeIn - Edge Case テスト
 *
 * 目的: 「壊そうとしても壊れない」ことを証明する
 *
 * 普通の使い方は wafu-fade-in.test.tsx で確認済み。
 * ここでは「実装者が想定していない使い方をしたらどうなる？」を検証する。
 *
 * Edge Case（エッジケース）= 方向の全パターン、極端な数値、環境差異、複数同時使用
 */
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import { WafuFadeIn } from "../wafu-fade-in";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// IntersectionObserver モックのセットアップ
// wafu-fade-in.test.tsx と同じ方式を踏襲する
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
  return el.closest("[class*=\"transition-all\"]") ?? el;
}
// ============================================
// 1. 5方向全テスト
//    → 全5方向（up/down/left/right/none）で正しい offset クラスが付くかを確認する
//    → directionOffset のマッピングが全方向で正しいことを保証する
// ============================================
describe("Edge: 5方向全ての offset クラス適用", () => {
  it("direction=up: 初期状態で translate-y-6 が付く", () => {
    // up = 下から上に飛び込む = 初期位置は下にずれている（translate-y-6）
    render(<WafuFadeIn direction="up">Up</WafuFadeIn>);
    const wrapper = getWrapper("Up");
    expect(wrapper.className).toContain("translate-y-6");
  });

  it("direction=down: 初期状態で -translate-y-6 が付く", () => {
    // down = 上から下に飛び込む = 初期位置は上にずれている（-translate-y-6）
    render(<WafuFadeIn direction="down">Down</WafuFadeIn>);
    const wrapper = getWrapper("Down");
    expect(wrapper.className).toContain("-translate-y-6");
  });

  it("direction=left: 初期状態で translate-x-6 が付く", () => {
    // left = 右から左に飛び込む = 初期位置は右にずれている（translate-x-6）
    render(<WafuFadeIn direction="left">Left</WafuFadeIn>);
    const wrapper = getWrapper("Left");
    expect(wrapper.className).toContain("translate-x-6");
  });

  it("direction=right: 初期状態で -translate-x-6 が付く", () => {
    // right = 左から右に飛び込む = 初期位置は左にずれている（-translate-x-6）
    render(<WafuFadeIn direction="right">Right</WafuFadeIn>);
    const wrapper = getWrapper("Right");
    expect(wrapper.className).toContain("-translate-x-6");
  });

  it("direction=none: 初期状態で translate クラスが付かない", () => {
    // none = 位置はずれず、フェードのみ（opacity-0 のみ）
    render(<WafuFadeIn direction="none">None</WafuFadeIn>);
    const wrapper = getWrapper("None");
    expect(wrapper.className).toContain("opacity-0");
    expect(wrapper.className).not.toContain("translate-");
  });

  it("direction=up: intersection 後に opacity-100 になる", () => {
    render(<WafuFadeIn direction="up">Up Visible</WafuFadeIn>);
    act(() => { triggerIntersection?.(); });
    const wrapper = getWrapper("Up Visible");
    expect(wrapper.className).toContain("opacity-100");
  });

  it("direction=none: intersection 後に opacity-100 になる", () => {
    render(<WafuFadeIn direction="none">None Visible</WafuFadeIn>);
    act(() => { triggerIntersection?.(); });
    const wrapper = getWrapper("None Visible");
    expect(wrapper.className).toContain("opacity-100");
  });

  it("デフォルト direction は up（省略時のフォールバック）", () => {
    // direction を省略したとき up と同じ挙動になるか
    render(<WafuFadeIn>Default</WafuFadeIn>);
    const wrapper = getWrapper("Default");
    expect(wrapper.className).toContain("translate-y-6");
  });
});
// ============================================
// 2. delay / duration の極端な値
//    → 0・負数・超大値でもクラッシュせず、style に正しく反映されるかを確認する
//    → CSS には -Xms や 999999ms も有効なため、コンポーネント側でクランプしないことを確認する
// ============================================
describe("Edge: delay / duration の極端な値", () => {
  it("delay=0 でもクラッシュしない", () => {
    render(<WafuFadeIn delay={0}>Zero Delay</WafuFadeIn>);
    const wrapper = getWrapper("Zero Delay") as HTMLElement;
    expect(wrapper.style.transitionDelay).toBe("0ms");
  });

  it("delay が負数（-100）でもクラッシュしない", () => {
    // CSS では transitionDelay が負の値のとき、アニメーションをその時間分スキップする
    // コンポーネントは値をそのまま渡す（バリデーションは呼び出し元の責務）
    render(<WafuFadeIn delay={-100}>Negative Delay</WafuFadeIn>);
    const wrapper = getWrapper("Negative Delay") as HTMLElement;
    expect(wrapper.style.transitionDelay).toBe("-100ms");
  });

  it("delay が超大値（999999）でもクラッシュしない", () => {
    render(<WafuFadeIn delay={999999}>Huge Delay</WafuFadeIn>);
    const wrapper = getWrapper("Huge Delay") as HTMLElement;
    expect(wrapper.style.transitionDelay).toBe("999999ms");
  });

  it("duration=0 でもクラッシュしない（即座に遷移）", () => {
    render(<WafuFadeIn duration={0}>Instant</WafuFadeIn>);
    const wrapper = getWrapper("Instant") as HTMLElement;
    expect(wrapper.style.transitionDuration).toBe("0ms");
  });

  it("duration が負数（-500）でもクラッシュしない", () => {
    // CSS では負の duration は無効扱いだが、コンポーネントはそのまま渡す
    render(<WafuFadeIn duration={-500}>Negative Duration</WafuFadeIn>);
    const wrapper = getWrapper("Negative Duration") as HTMLElement;
    expect(wrapper.style.transitionDuration).toBe("-500ms");
  });

  it("duration が超大値（9999999）でもクラッシュしない", () => {
    render(<WafuFadeIn duration={9999999}>Very Slow</WafuFadeIn>);
    const wrapper = getWrapper("Very Slow") as HTMLElement;
    expect(wrapper.style.transitionDuration).toBe("9999999ms");
  });

  it("delay と duration が両方 0 の組み合わせでもクラッシュしない", () => {
    render(<WafuFadeIn delay={0} duration={0}>Zero Both</WafuFadeIn>);
    const wrapper = getWrapper("Zero Both") as HTMLElement;
    expect(wrapper.style.transitionDelay).toBe("0ms");
    expect(wrapper.style.transitionDuration).toBe("0ms");
  });

  it("delay と duration が両方超大値の組み合わせでもクラッシュしない", () => {
    render(<WafuFadeIn delay={999999} duration={9999999}>Both Huge</WafuFadeIn>);
    const wrapper = getWrapper("Both Huge") as HTMLElement;
    expect(wrapper.style.transitionDelay).toBe("999999ms");
    expect(wrapper.style.transitionDuration).toBe("9999999ms");
  });
});
// ============================================
// 3. IntersectionObserver が未対応の環境
//    → SSR・古いブラウザなど IntersectionObserver が存在しない環境でのフォールバック挙動
//    → コンポーネントがクラッシュしないことを確認する（レンダリング段階のみ）
// ============================================
describe("Edge: IntersectionObserver が未対応の環境", () => {
  it("IntersectionObserver が undefined の環境でも render 自体はクラッシュしない", () => {
    // jsdom では IntersectionObserver がデフォルトで存在しないが、
    // beforeEach でモックしているので一旦 undefined に戻す
    vi.stubGlobal("IntersectionObserver", undefined);

    // useEffect の中で new IntersectionObserver() を呼ぶが、
    // React の render フェーズ自体は useEffect 前に完了する。
    // そのため render がクラッシュしないことを確認できる。
    expect(() => {
      render(<WafuFadeIn>No Observer</WafuFadeIn>);
    }).not.toThrow();
  });

  it("IntersectionObserver が undefined のとき、初期 opacity-0 のままである", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<WafuFadeIn>Fallback</WafuFadeIn>);
    const wrapper = getWrapper("Fallback");
    // observe が呼ばれないため isVisible は false のまま
    expect(wrapper.className).toContain("opacity-0");
  });
});

// ============================================
// 4. 複数 WafuFadeIn の同時使用
//    → 3つ以上同時にマウントしたとき、それぞれが独立して動作するかを確認する
//    → 各インスタンスが独立した ref・state を持つことを確認する
// ============================================
describe("Edge: 複数 WafuFadeIn の同時使用", () => {
  it("3つ同時にマウントしても全員がレンダリングされる", () => {
    render(
      <>
        <WafuFadeIn direction="up">要素A</WafuFadeIn>
        <WafuFadeIn direction="left">要素B</WafuFadeIn>
        <WafuFadeIn direction="none">要素C</WafuFadeIn>
      </>
    );
    expect(screen.getByText("要素A")).toBeDefined();
    expect(screen.getByText("要素B")).toBeDefined();
    expect(screen.getByText("要素C")).toBeDefined();
  });

  it("3つ同時にマウントしたとき全員が初期 opacity-0 の状態になる", () => {
    render(
      <>
        <WafuFadeIn direction="up">A</WafuFadeIn>
        <WafuFadeIn direction="down">B</WafuFadeIn>
        <WafuFadeIn direction="none">C</WafuFadeIn>
      </>
    );
    expect(getWrapper("A").className).toContain("opacity-0");
    expect(getWrapper("B").className).toContain("opacity-0");
    expect(getWrapper("C").className).toContain("opacity-0");
  });

  it("各インスタンスが異なる delay/duration を持てる", () => {
    render(
      <>
        <WafuFadeIn delay={0} duration={300}>Fast</WafuFadeIn>
        <WafuFadeIn delay={500} duration={1000}>Slow</WafuFadeIn>
      </>
    );
    const fast = getWrapper("Fast") as HTMLElement;
    const slow = getWrapper("Slow") as HTMLElement;
    expect(fast.style.transitionDelay).toBe("0ms");
    expect(fast.style.transitionDuration).toBe("300ms");
    expect(slow.style.transitionDelay).toBe("500ms");
    expect(slow.style.transitionDuration).toBe("1000ms");
  });

  it("異なる className を持つ複数インスタンスが共存できる", () => {
    render(
      <>
        <WafuFadeIn className="section-hero">ヒーロー</WafuFadeIn>
        <WafuFadeIn className="section-content">コンテンツ</WafuFadeIn>
      </>
    );
    expect(getWrapper("ヒーロー").className).toContain("section-hero");
    expect(getWrapper("コンテンツ").className).toContain("section-content");
  });
});

// ============================================
// 5. className の透過
//    → カスタムクラスが transition-all などのベースクラスと共存するかを確認する
//    → 空・スペースのみでもクラッシュしないことを確認する
// ============================================
describe("Edge: className の透過", () => {
  it("独自 className がベースクラスと共存する", () => {
    render(<WafuFadeIn className="my-section">Content</WafuFadeIn>);
    const wrapper = getWrapper("Content");
    expect(wrapper.className).toContain("transition-all");
    expect(wrapper.className).toContain("my-section");
  });

  it("空の className でもクラッシュしない", () => {
    render(<WafuFadeIn className="">Empty</WafuFadeIn>);
    const wrapper = getWrapper("Empty");
    expect(wrapper.className).toContain("transition-all");
  });

  it("スペースのみの className でもクラッシュしない", () => {
    render(<WafuFadeIn className="   ">Space</WafuFadeIn>);
    expect(screen.getByText("Space")).toBeDefined();
  });
});

// ============================================
// 6. children の極端な入力
//    → children に複雑な JSX・長文テキスト・絵文字が入ってもクラッシュしないか
// ============================================
describe("Edge: children の極端な入力", () => {
  it("children に超長文テキストを渡してもクラッシュしない", () => {
    const longText = "旅館のご案内".repeat(1000);
    render(<WafuFadeIn>{longText}</WafuFadeIn>);
    expect(screen.getByText(longText)).toBeDefined();
  });

  it("children に絵文字・記号が含まれても表示される", () => {
    render(<WafuFadeIn>🌸🎋🍁❄️ 和の旅</WafuFadeIn>);
    expect(screen.getByText("🌸🎋🍁❄️ 和の旅")).toBeDefined();
  });

  it("children にネストした JSX を渡してもクラッシュしない", () => {
    render(
      <WafuFadeIn>
        <div>
          <h2>見出し</h2>
          <p>説明文</p>
        </div>
      </WafuFadeIn>
    );
    expect(screen.getByText("見出し")).toBeDefined();
    expect(screen.getByText("説明文")).toBeDefined();
  });
});
