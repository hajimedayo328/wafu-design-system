/**
 * アクセシビリティ自動テスト（axe-core による WCAG 準拠チェック）
 *
 * なぜこのテストが必要か：
 * - 和風デザインシステムは旅館・観光サイト向けを想定しており、
 *   高齢者・視覚障害者など多様なユーザーが利用する可能性がある
 * - スクリーンリーダーやキーボードのみで操作するユーザーへの対応は、
 *   見た目だけでは確認できないため、自動テストで継続的に保証する
 * - WCAG 2.1 AA 準拠を担保することで、公的機関・商業施設向け納品時の
 *   品質基準も満たせる
 *
 * テスト戦略：
 * - axe-core でレンダリング済みDOM全体をスキャン → WCAG ルール違反を検出
 * - 各コンポーネントの全バリアント・全状態をカバー
 * - 「視覚的に問題なく見える」が「a11y的には問題あり」なケースを自動検出
 */

import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import { toHaveNoViolations } from "vitest-axe/matchers.js";

import { WafuButton } from "../wafu-button";
import { RyokanCard } from "../ryokan-card";
import { SeasonSection } from "../season-section";
import { WafuFadeIn } from "../wafu-fade-in";
import { WafuDivider } from "../wafu-divider";
import { WafuI18nProvider } from "../i18n";

// vitest-axe のカスタムマッチャーを登録
// toHaveNoViolations は関数として export されるため、
// オブジェクト形式 { toHaveNoViolations } で expect.extend に渡す
expect.extend({ toHaveNoViolations });

// jsdom 環境では IntersectionObserver が存在しないため、グローバルにモックする。
// WafuFadeIn はこの API を使ってスクロール連動アニメーションを実現しており、
// a11yスキャンには DOM が必要なため render 自体を成功させる必要がある。
beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      constructor(_callback: IntersectionObserverCallback) {}
    }
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// ============================================================
// WafuButton アクセシビリティテスト
//
// ボタンは最も基本的なインタラクティブ要素。
// スクリーンリーダーが「ボタン」として認識できるか、
// テキストラベルがあるか、disabled 状態の通知が正しいかを確認する。
// ============================================================
describe("WafuButton - アクセシビリティ (axe-core)", () => {
  it("デフォルト（ai バリアント）: WCAG 違反がない", async () => {
    const { container } = render(<WafuButton>予約する</WafuButton>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // 6バリアント全部をスキャン
  // バリアントによっては色コントラストが不足する可能性があるため全数チェックが必要
  it.each([
    ["ai", "藍色のボタン"],
    ["momiji", "紅葉色のボタン"],
    ["kohaku", "琥珀色のボタン"],
    ["take", "竹色のボタン"],
    ["ghost", "ゴーストボタン"],
    ["outline", "アウトラインボタン"],
  ] as const)(
    "variant=%s（%s）: WCAG 違反がない",
    async (variant, label) => {
      const { container } = render(
        <WafuButton variant={variant}>{label}</WafuButton>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  );

  // disabled 状態の a11y チェック
  // HTML native の disabled 属性はスクリーンリーダーが「グレーアウト」と読み上げるため
  // aria-disabled より明確。この挙動が壊れていないか確認する
  it("disabled 状態: WCAG 違反がない", async () => {
    const { container } = render(
      <WafuButton disabled>予約（受付終了）</WafuButton>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // aria-label が正しく渡せるか（アイコンのみのボタンなどに必要）
  it("aria-label 付き: WCAG 違反がない", async () => {
    const { container } = render(
      <WafuButton aria-label="お気に入りに追加">★</WafuButton>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // type=submit はフォーム内で使われるケース
  it("type=submit: WCAG 違反がない", async () => {
    const { container } = render(
      <form>
        <WafuButton type="submit">送信する</WafuButton>
      </form>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // サイズバリアント
  it.each(["sm", "md", "lg"] as const)(
    "size=%s: WCAG 違反がない",
    async (size) => {
      const { container } = render(
        <WafuButton size={size}>サイズテスト</WafuButton>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  );
});

// ============================================================
// RyokanCard アクセシビリティテスト
//
// カードコンポーネントは article 要素を使っており、
// スクリーンリーダーが「コンテンツのまとまり」として認識できるか確認する。
// 画像の alt テキスト、価格情報の読み上げ順序も自動チェックされる。
// ============================================================
describe("RyokanCard - アクセシビリティ (axe-core)", () => {
  // デフォルト（featured=false）
  it("default バリアント: WCAG 違反がない", async () => {
    const { container } = render(
      <WafuI18nProvider locale="ja">
        <RyokanCard
          roomName="山側和室"
          description="山々を望む静かな和室です。"
          price="¥15,000"
        />
      </WafuI18nProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // featured バリアント（「おすすめ」バッジが追加される）
  // バッジのテキストがスクリーンリーダーに伝わるか確認
  it("featured バリアント: WCAG 違反がない", async () => {
    const { container } = render(
      <WafuI18nProvider locale="ja">
        <RyokanCard
          roomName="露天風呂付き特別室"
          description="開放的な露天風呂を備えた最高級の客室。"
          price="¥45,000"
          variant="featured"
        />
      </WafuI18nProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // 画像あり：img の alt テキストが roomName と一致するか axe が確認する
  it("imageSrc あり（alt テキスト付き）: WCAG 違反がない", async () => {
    const { container } = render(
      <WafuI18nProvider locale="ja">
        <RyokanCard
          roomName="庭園ビュー和室"
          description="美しい日本庭園を眺める客室。"
          price="¥20,000"
          imageSrc="https://example.com/room.jpg"
        />
      </WafuI18nProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // 英語ロケール
  it("英語ロケール（locale=en）: WCAG 違反がない", async () => {
    const { container } = render(
      <WafuI18nProvider locale="en">
        <RyokanCard
          roomName="Japanese Suite"
          description="A serene Japanese-style room."
          price="¥20,000"
        />
      </WafuI18nProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // カスタム CTA ラベル
  it("ctaLabel カスタム: WCAG 違反がない", async () => {
    const { container } = render(
      <WafuI18nProvider locale="ja">
        <RyokanCard
          roomName="スイートルーム"
          description="最上級のおもてなし。"
          price="¥80,000"
          ctaLabel="空室を確認する"
        />
      </WafuI18nProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ============================================================
// SeasonSection アクセシビリティテスト
//
// section 要素 + aria-label で「春のセクション」等として識別される。
// 絵文字アイコンに role="img" と aria-label が付いており、
// スクリーンリーダーが絵文字を無意味な文字として読まないようになっているか確認する。
// ============================================================
describe("SeasonSection - アクセシビリティ (axe-core)", () => {
  // 4シーズン全てをチェック
  // 各シーズンで配色が異なるため、色コントラストも検証される
  it.each([
    ["spring", "春の庭園", "桜が満開の季節"],
    ["summer", "夏の緑陰", "青々とした竹林"],
    ["autumn", "秋の紅葉", "色づく山々"],
    ["winter", "冬の静寂", "雪景色の湯けむり"],
  ] as const)(
    "season=%s（%s）: WCAG 違反がない",
    async (season, title, subtitle) => {
      const { container } = render(
        <WafuI18nProvider locale="ja">
          <SeasonSection season={season} title={title} subtitle={subtitle} />
        </WafuI18nProvider>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  );

  // subtitle なし（省略可能な props のケース）
  it("subtitle なし: WCAG 違反がない", async () => {
    const { container } = render(
      <WafuI18nProvider locale="ja">
        <SeasonSection season="spring" title="春の特別プラン" />
      </WafuI18nProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // 子要素あり（コンテンツを内包するケース）
  it("children あり: WCAG 違反がない", async () => {
    const { container } = render(
      <WafuI18nProvider locale="ja">
        <SeasonSection season="autumn" title="秋の客室プラン">
          <p>紅葉の季節に合わせた特別プランをご用意しました。</p>
        </SeasonSection>
      </WafuI18nProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ============================================================
// WafuFadeIn アクセシビリティテスト
//
// アニメーションラッパーコンポーネント。
// アニメーション自体はアクセシビリティに影響しないが、
// コンテンツが正しく DOM に存在し読み上げ可能であることを確認する。
// また、motion-reduce メディアクエリへの対応は CSS 側で行う前提。
// ============================================================
describe("WafuFadeIn - アクセシビリティ (axe-core)", () => {
  it("デフォルト（direction=up）: WCAG 違反がない", async () => {
    const { container } = render(
      <WafuFadeIn>
        <p>フェードインするコンテンツ</p>
      </WafuFadeIn>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // 全フェード方向をチェック
  it.each(["up", "down", "left", "right", "none"] as const)(
    "direction=%s: WCAG 違反がない",
    async (direction) => {
      const { container } = render(
        <WafuFadeIn direction={direction}>
          <span>アニメーションテキスト</span>
        </WafuFadeIn>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  );

  // インタラクティブな子要素を内包するケース
  // ラッパーdivがフォーカス管理を壊さないか確認する
  it("インタラクティブな子要素（ボタン）を内包: WCAG 違反がない", async () => {
    const { container } = render(
      <WafuFadeIn>
        <WafuButton>フェードインするボタン</WafuButton>
      </WafuFadeIn>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // 見出しを内包するケース（セクションの冒頭に使われることが多い）
  it("見出し（h2）を内包: WCAG 違反がない", async () => {
    const { container } = render(
      <WafuFadeIn>
        <h2>セクションタイトル</h2>
      </WafuFadeIn>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ============================================================
// WafuDivider アクセシビリティテスト
//
// 区切り要素は視覚的な区切りを示すだけでなく、
// role="separator" により支援技術にも「区切り」として認識される。
// dots/wave バリアントは div + role="separator" を使っており、
// スクリーンリーダーが意味不明な文字を読み上げないか確認する。
// ============================================================
describe("WafuDivider - アクセシビリティ (axe-core)", () => {
  // line バリアント（hr 要素 = 意味的な区切り）
  it("line バリアント（hr 要素）: WCAG 違反がない", async () => {
    const { container } = render(
      <div>
        <p>上のコンテンツ</p>
        <WafuDivider variant="line" />
        <p>下のコンテンツ</p>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // dots バリアント（div + role="separator" + 装飾的なspan）
  // 装飾的な span が aria-hidden なしでも読み上げられない理由を axe が検証
  it("dots バリアント: WCAG 違反がない", async () => {
    const { container } = render(
      <div>
        <p>上のコンテンツ</p>
        <WafuDivider variant="dots" />
        <p>下のコンテンツ</p>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // wave バリアント（「〜〜〜」という装飾テキストを含む）
  // 装飾的な文字列がスクリーンリーダーに無意味に読み上げられないか確認
  it("wave バリアント: WCAG 違反がない", async () => {
    const { container } = render(
      <div>
        <p>上のコンテンツ</p>
        <WafuDivider variant="wave" />
        <p>下のコンテンツ</p>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // デフォルト（variant 未指定 = line）
  it("デフォルト（variant 未指定）: WCAG 違反がない", async () => {
    const { container } = render(
      <div>
        <WafuDivider />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ============================================================
// 複合コンポーネント アクセシビリティテスト
//
// 実際のページでは複数コンポーネントが組み合わさる。
// 単体では問題なくても組み合わせで ARIA ランドマークが重複したり、
// 見出し階層が崩れたりする問題を検出するために統合テストも行う。
// ============================================================
describe("複合コンポーネント - アクセシビリティ (axe-core)", () => {
  it("SeasonSection + RyokanCard の組み合わせ: WCAG 違反がない", async () => {
    const { container } = render(
      <WafuI18nProvider locale="ja">
        <SeasonSection season="autumn" title="秋の客室プラン" subtitle="紅葉の季節にぴったりの客室をご用意しました。">
          <RyokanCard
            roomName="紅葉ビュー和室"
            description="窓から紅葉を望む特別な和室。"
            price="¥25,000"
          />
        </SeasonSection>
      </WafuI18nProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("WafuFadeIn + RyokanCard の組み合わせ: WCAG 違反がない", async () => {
    const { container } = render(
      <WafuI18nProvider locale="ja">
        <WafuFadeIn direction="up">
          <RyokanCard
            roomName="温泉付き特別室"
            description="プライベート温泉を楽しめる特別室。"
            price="¥50,000"
            variant="featured"
          />
        </WafuFadeIn>
      </WafuI18nProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ページレイアウト全体（全コンポーネント組み合わせ）: WCAG 違反がない", async () => {
    const { container } = render(
      <WafuI18nProvider locale="ja">
        <main>
          <h1>旅館のご案内</h1>

          <WafuFadeIn direction="up">
            <SeasonSection season="spring" title="春の特別プラン" subtitle="桜の季節だけの特別なおもてなし。">
              <RyokanCard
                roomName="桜ビュー和室"
                description="桜の木を望む特別な和室です。"
                price="¥18,000"
              />
            </SeasonSection>
          </WafuFadeIn>

          <WafuDivider variant="dots" />

          <WafuFadeIn direction="up" delay={200}>
            <SeasonSection season="autumn" title="秋の特別プラン">
              <RyokanCard
                roomName="紅葉特別室"
                description="紅葉を望む最上級の客室。"
                price="¥45,000"
                variant="featured"
              />
            </SeasonSection>
          </WafuFadeIn>

          <WafuDivider variant="line" />

          <WafuButton>全客室を見る</WafuButton>
        </main>
      </WafuI18nProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
