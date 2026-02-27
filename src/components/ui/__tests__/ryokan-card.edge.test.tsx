/**
 * RyokanCard - Edge Case テスト
 *
 * 目的: 「壊そうとしても壊れない」ことを証明する
 *
 * 普通の使い方は ryokan-card.test.tsx で確認済み。
 * ここでは「実装者が想定していない使い方をしたらどうなる？」を検証する。
 *
 * Edge Case（エッジケース）= 境界値、異常値、極端な入力
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { RyokanCard } from "../ryokan-card";
import { WafuI18nProvider } from "../i18n";

afterEach(() => { cleanup(); });

const minimalProps = {
  roomName: "紅葉の間",
  description: "静かな庭園を望む客室。",
  price: "¥48,000",
};
// ============================================
// 1. 極端な roomName / description / price
//    → 想定外の入力値でクラッシュしないか確認
//    → セキュリティ: XSS 系の特殊文字が安全に扱われるか
// ============================================
describe("極端な roomName / description / price", () => {
  it("roomName が超長文（2000文字）でもクラッシュしない", () => {
    // 部屋名を API から動的に取得する場合、長さのバリデーション前にレンダリングされうるシナリオを想定
    const longName = "山".repeat(2000);
    render(<RyokanCard {...minimalProps} roomName={longName} />);
    expect(screen.getByRole("heading").textContent).toBe(longName);
    expect(screen.getByRole("article").getAttribute("aria-label")).toBe(longName);
  });

  it("description が超長文でもクラッシュしない", () => {
    const longDesc = "この客室は".repeat(500);
    render(<RyokanCard {...minimalProps} description={longDesc} />);
    expect(screen.getByText(longDesc)).toBeDefined();
  });

  it("roomName に HTML タグ文字列が含まれても XSS にならない", () => {
    // React は文字列を自動エスケープするため XSS にはならないが、クラッシュもしないことを確認する
    const xssName = String.raw`<script>alert("xss")</script>`;
    render(<RyokanCard {...minimalProps} roomName={xssName} />);
    const heading = screen.getByRole("heading");
    expect(heading.textContent).toBe(xssName);
    expect(document.querySelector("script")).toBeNull();
  });

  it("price が空文字でもクラッシュしない", () => {
    render(<RyokanCard {...minimalProps} price="" />);
    expect(screen.getByRole("article")).toBeDefined();
  });

  it("price に数字以外のテキストが入ってもクラッシュしない", () => {
    render(<RyokanCard {...minimalProps} price="要問い合わせ" />);
    expect(screen.getByText("要問い合わせ")).toBeDefined();
  });

  it("price に記号なしの数字のみでもクラッシュしない", () => {
    render(<RyokanCard {...minimalProps} price="48000" />);
    expect(screen.getByText("48000")).toBeDefined();
  });

  it("price に超高額（1億円）でもクラッシュしない", () => {
    render(<RyokanCard {...minimalProps} price="¥100,000,000" />);
    expect(screen.getByText("¥100,000,000")).toBeDefined();
  });

  it("price が 0 円でもクラッシュしない", () => {
    render(<RyokanCard {...minimalProps} price="¥0" />);
    expect(screen.getByText("¥0")).toBeDefined();
  });

  it("price にマイナス値が入ってもクラッシュしない", () => {
    render(<RyokanCard {...minimalProps} price="-¥5,000" />);
    expect(screen.getByText("-¥5,000")).toBeDefined();
  });

  it("description が空文字でもクラッシュしない", () => {
    render(<RyokanCard {...minimalProps} description="" />);
    expect(screen.getByRole("article")).toBeDefined();
  });

  it("roomType に絵文字が含まれても表示される", () => {
    render(<RyokanCard {...minimalProps} roomType="🍁 特別室" />);
    expect(screen.getByText("🍁 特別室")).toBeDefined();
  });

  it("ctaLabel が超長文でもクラッシュしない", () => {
    const longLabel = "今すぐ予約してお得なプランをゲット！".repeat(10);
    render(<RyokanCard {...minimalProps} ctaLabel={longLabel} />);
    expect(screen.getByRole("button").textContent).toBe(longLabel);
  });
});
// ============================================
// 2. props の組み合わせ爆発
//    → 全 props を同時に渡したとき矛盾・クラッシュが起きないか
//    → featured + 各オプションの組み合わせが安全かを確認
// ============================================
describe("props の組み合わせ", () => {
  it("全 props を同時に渡しても壊れない", () => {
    // 実装者が想定していない組み合わせで使われる可能性がある
    const handleClick = vi.fn();
    render(
      <RyokanCard
        roomName="特別大浴場付き離れ"
        roomType="離れ"
        description="専用大浴場を完備した最上級の離れ客室です。"
        price="¥120,000"
        priceUnit="/ 一泊（2名）"
        imageSrc="https://example.com/room.jpg"
        variant="featured"
        ctaLabel="今すぐ予約"
        onCtaClick={handleClick}
      >
        <p>特典: ウェルカムドリンク付き</p>
      </RyokanCard>
    );
    expect(screen.getByRole("heading", { name: "特別大浴場付き離れ" })).toBeDefined();
    expect(screen.getByText("離れ")).toBeDefined();
    expect(screen.getByText("¥120,000")).toBeDefined();
    expect(screen.getByText("/ 一泊（2名）")).toBeDefined();
    expect(screen.getByText("おすすめ")).toBeDefined();
    expect(screen.getByRole("button", { name: "今すぐ予約" })).toBeDefined();
    expect(screen.getByText("特典: ウェルカムドリンク付き")).toBeDefined();
  });

  it("featured + imageSrc なしの組み合わせでバッジとプレースホルダーが共存する", () => {
    render(<RyokanCard {...minimalProps} variant="featured" />);
    expect(screen.getByText("おすすめ")).toBeDefined();
    const placeholders = screen.getAllByText("紅葉の間");
    expect(placeholders.length).toBeGreaterThanOrEqual(2);
  });

  it("featured + children + カスタム priceUnit の組み合わせ", () => {
    render(
      <RyokanCard {...minimalProps} variant="featured" priceUnit="/ 2名1泊">
        <ul><li>夕食付き</li><li>朝食付き</li></ul>
      </RyokanCard>
    );
    expect(screen.getByText("おすすめ")).toBeDefined();
    expect(screen.getByText("/ 2名1泊")).toBeDefined();
    expect(screen.getByText("夕食付き")).toBeDefined();
    expect(screen.getByText("朝食付き")).toBeDefined();
  });

  it("variant='default' は Kohaku ボーダークラスを含まない", () => {
    render(<RyokanCard {...minimalProps} variant="default" />);
    const article = screen.getByRole("article");
    expect(article.className).not.toContain("border-wafu-kohaku");
  });

  it("variant='featured' は Kohaku ボーダークラスを含む", () => {
    render(<RyokanCard {...minimalProps} variant="featured" />);
    const article = screen.getByRole("article");
    expect(article.className).toContain("border-wafu-kohaku");
  });

  it("priceUnit のみ指定して ctaLabel は未指定（デフォルトフォールバック確認）", () => {
    render(<RyokanCard {...minimalProps} priceUnit="/ 人" />);
    expect(screen.getByText("/ 人")).toBeDefined();
    expect(screen.getByRole("button", { name: "予約する" })).toBeDefined();
  });

  it("ctaLabel のみ指定して priceUnit は未指定（デフォルトフォールバック確認）", () => {
    render(<RyokanCard {...minimalProps} ctaLabel="詳細を見る" />);
    expect(screen.getByRole("button", { name: "詳細を見る" })).toBeDefined();
    expect(screen.getByText("/ 一泊")).toBeDefined();
  });
});
// ============================================
// 3. 画像関連のエッジケース
//    → imageSrc の有無・壊れた URL でのフォールバック動作を確認
//    → アクセシビリティ: img の alt 属性が roomName と一致するか
// ============================================
describe("画像関連", () => {
  it("imageSrc が undefined のとき img タグが表示されない", () => {
    render(<RyokanCard {...minimalProps} />);
    expect(document.querySelector("img")).toBeNull();
  });

  it("imageSrc が undefined のとき roomName がプレースホルダーとして表示される", () => {
    render(<RyokanCard {...minimalProps} roomName="松の間" />);
    const matches = screen.getAllByText("松の間");
    // heading と image プレースホルダーの両方に表示される
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("imageSrc を渡すと img タグが表示される", () => {
    render(<RyokanCard {...minimalProps} imageSrc="https://example.com/room.jpg" />);
    const img = document.querySelector("img") as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.src).toBe("https://example.com/room.jpg");
  });

  it("img の alt 属性が roomName と一致する（アクセシビリティ）", () => {
    // スクリーンリーダーが「紅葉の間の画像」と読み上げられるか
    render(<RyokanCard {...minimalProps} imageSrc="https://example.com/room.jpg" />);
    const img = document.querySelector("img") as HTMLImageElement;
    expect(img.alt).toBe("紅葉の間");
  });

  it("壊れた URL を渡しても img タグはレンダリングされる（読み込み失敗はブラウザが処理）", () => {
    // URL の形式チェックはコンポーネントの責務外。壊れた URL でもクラッシュしない。
    render(<RyokanCard {...minimalProps} imageSrc="not-a-valid-url" />);
    const img = document.querySelector("img") as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.src).toContain("not-a-valid-url");
  });

  it("空文字の imageSrc を渡した場合はプレースホルダーが表示される", () => {
    // imageSrc="" は JS の falsy 判定で <div> プレースホルダーになることを確認
    render(<RyokanCard {...minimalProps} imageSrc="" />);
    expect(document.querySelector("img")).toBeNull();
    const placeholders = screen.getAllByText("紅葉の間");
    expect(placeholders.length).toBeGreaterThanOrEqual(2);
  });

  it("data URI（base64 画像）を渡してもクラッシュしない", () => {
    // 小さいサムネイルを base64 で直接埋め込むユースケース
    const dataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    render(<RyokanCard {...minimalProps} imageSrc={dataUri} />);
    const img = document.querySelector("img") as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.src).toBe(dataUri);
  });
});
// ============================================
// 4. children のエッジケース
//    → children は price/CTA の前に自由に挿入できる
//    → children が null / false の場合も安全かを確認
// ============================================
describe("極端な children", () => {
  it("children なしでもクラッシュしない", () => {
    render(<RyokanCard {...minimalProps} />);
    expect(screen.getByRole("article")).toBeDefined();
  });

  it("複数の children 要素でもクラッシュしない", () => {
    render(
      <RyokanCard {...minimalProps}>
        <div>特典A</div>
        <div>特典B</div>
        <div>特典C</div>
      </RyokanCard>
    );
    expect(screen.getByText("特典A")).toBeDefined();
    expect(screen.getByText("特典B")).toBeDefined();
    expect(screen.getByText("特典C")).toBeDefined();
  });

  it("children に混在した JSX を渡してもクラッシュしない", () => {
    render(
      <RyokanCard {...minimalProps}>
        <section><h4>設備</h4><ul><li><span>専用露天風呂</span></li></ul></section>
      </RyokanCard>
    );
    expect(screen.getByText("専用露天風呂")).toBeDefined();
  });

  it("children に超長文テキストを渡してもクラッシュしない", () => {
    const longText = "設備: " + "大浴場・".repeat(500);
    render(<RyokanCard {...minimalProps}><p>{longText}</p></RyokanCard>);
    expect(screen.getByText(longText)).toBeDefined();
  });

  it("children に null を渡してもクラッシュしない", () => {
    // JSX では {null} は何も表示しない。クラッシュしないことを確認。
    render(<RyokanCard {...minimalProps}>{null}</RyokanCard>);
    expect(screen.getByRole("article")).toBeDefined();
  });

  it("children に false を渡してもクラッシュしない", () => {
    // {someCondition && <Component />} パターンで false が渡るケース
    render(<RyokanCard {...minimalProps}>{false}</RyokanCard>);
    expect(screen.getByRole("article")).toBeDefined();
  });
});

// ============================================
// 5. イベントハンドラの透過
//    → onCtaClick は WafuButton に渡される
//    → ハンドラが正しく発火し、かつ複数回でも安全かを確認
// ============================================
describe("イベントハンドラ", () => {
  it("onCtaClick なしでボタンをクリックしてもクラッシュしない", () => {
    // onCtaClick が省略されたとき WafuButton は undefined を受け取る。TypeError にならないことを確認
    render(<RyokanCard {...minimalProps} />);
    expect(() => { fireEvent.click(screen.getByRole("button")); }).not.toThrow();
  });

  it("onCtaClick が正しく発火する", () => {
    const handleClick = vi.fn();
    render(<RyokanCard {...minimalProps} onCtaClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("100 回連続クリックしても全部発火する", () => {
    // throttle や debounce をコンポーネント内で掌けていないことを確認
    const handleClick = vi.fn();
    render(<RyokanCard {...minimalProps} onCtaClick={handleClick} />);
    const button = screen.getByRole("button");
    for (let i = 0; i < 100; i++) { fireEvent.click(button); }
    expect(handleClick).toHaveBeenCalledTimes(100);
  });

  it("ハンドラが非同期関数でもクラッシュしない", () => {
    // 予約 API を呼ぶ非同期関数を渡すことが多い
    const asyncHandler = vi.fn(async () => { await Promise.resolve("ok"); });
    render(<RyokanCard {...minimalProps} onCtaClick={asyncHandler} />);
    expect(() => { fireEvent.click(screen.getByRole("button")); }).not.toThrow();
    expect(asyncHandler).toHaveBeenCalledOnce();
  });

  it("ハンドラが呼ばれたことを確認できる（エラー伝播はブラウザ依存）", () => {
    // React のイベントシステム内での throw は fireEvent.click で
    // キャッチできない（React が内部で処理する）ため、
    // ハンドラの呼び出し自体を確認するに留める
    const handler = vi.fn();
    render(<RyokanCard {...minimalProps} onCtaClick={handler} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handler).toHaveBeenCalledOnce();
  });
});
// ============================================
// 6. アクセシビリティ属性のエッジケース
//    → aria-label は article に roomName が設定される（コンポーネント固定値）
//    → roomName が変わると aria-label も追従するかを確認
// ============================================
describe("アクセシビリティ属性", () => {
  it("article の aria-label が roomName と一致する", () => {
    render(<RyokanCard {...minimalProps} roomName="竹の間" />);
    const article = screen.getByRole("article");
    expect(article.getAttribute("aria-label")).toBe("竹の間");
  });

  it("roomName 変更時に aria-label も追従する", () => {
    // roomName が API から更新される場合（SWR の revalidate 等）
    const { rerender } = render(<RyokanCard {...minimalProps} roomName="松の間" />);
    expect(screen.getByRole("article").getAttribute("aria-label")).toBe("松の間");
    rerender(<RyokanCard {...minimalProps} roomName="竹の間" />);
    expect(screen.getByRole("article").getAttribute("aria-label")).toBe("竹の間");
  });

  it("article ロールが存在する（スクリーンリーダー向け）", () => {
    render(<RyokanCard {...minimalProps} />);
    expect(screen.getByRole("article")).toBeDefined();
  });

  it("img の alt が roomName と一致する（imageSrc あり）", () => {
    render(<RyokanCard {...minimalProps} roomName="梅の間" imageSrc="https://example.com/img.jpg" />);
    const img = document.querySelector("img") as HTMLImageElement;
    expect(img.alt).toBe("梅の間");
  });

  it("CTA ボタンが tabIndex=-1 でない（キーボードフォーカス可能）", () => {
    render(<RyokanCard {...minimalProps} />);
    const button = screen.getByRole("button");
    expect(button.getAttribute("tabindex")).not.toBe("-1");
  });

  it("roomName が超長文でも article の aria-label に完全な値が設定される", () => {
    const longName = "離れ露天風呂付き特別室".repeat(50);
    render(<RyokanCard {...minimalProps} roomName={longName} />);
    expect(screen.getByRole("article").getAttribute("aria-label")).toBe(longName);
  });
});

// ============================================
// 7. i18n との連携エッジケース
//    → locale 切替でデフォルトフォールバックが正しく変わるか
//    → WafuI18nProvider なし（デフォルト "ja"）でも動くかは基本テストで確認済み
// ============================================
describe("i18n ロケール切替", () => {
  it("locale='en' のとき CTA が 'Book Now' になる", () => {
    // 多言語サイトで英語ロケールに切り替えた場合
    render(
      <WafuI18nProvider locale="en">
        <RyokanCard {...minimalProps} />
      </WafuI18nProvider>
    );
    expect(screen.getByRole("button", { name: "Book Now" })).toBeDefined();
  });

  it("locale='en' のとき priceUnit が '/ night' になる", () => {
    render(
      <WafuI18nProvider locale="en">
        <RyokanCard {...minimalProps} />
      </WafuI18nProvider>
    );
    expect(screen.getByText("/ night")).toBeDefined();
  });

  it("locale='en' かつ ctaLabel を明示した場合はカスタム値が優先される", () => {
    // i18n より明示的な props が優先されること
    render(
      <WafuI18nProvider locale="en">
        <RyokanCard {...minimalProps} ctaLabel="今すぐ予約" />
      </WafuI18nProvider>
    );
    expect(screen.getByRole("button", { name: "今すぐ予約" })).toBeDefined();
    expect(screen.queryByRole("button", { name: "Book Now" })).toBeNull();
  });

  it("locale='en' + variant='featured' のときバッジが 'Recommended' になる", () => {
    render(
      <WafuI18nProvider locale="en">
        <RyokanCard {...minimalProps} variant="featured" />
      </WafuI18nProvider>
    );
    expect(screen.getByText("Recommended")).toBeDefined();
    expect(screen.queryByText("おすすめ")).toBeNull();
  });

  it("locale='ja' のとき priceUnit が '/ 一泊' になる（デフォルト確認）", () => {
    render(
      <WafuI18nProvider locale="ja">
        <RyokanCard {...minimalProps} />
      </WafuI18nProvider>
    );
    expect(screen.getByText("/ 一泊")).toBeDefined();
  });

  it("locale='en' + priceUnit を明示した場合はカスタム値が優先される", () => {
    // i18n より明示的な props が優先されること
    render(
      <WafuI18nProvider locale="en">
        <RyokanCard {...minimalProps} priceUnit="/ 2名1泊" />
      </WafuI18nProvider>
    );
    expect(screen.getByText("/ 2名1泊")).toBeDefined();
    expect(screen.queryByText("/ night")).toBeNull();
  });
});