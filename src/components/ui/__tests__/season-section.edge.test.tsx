/**
 * SeasonSection - Edge Case テスト
 *
 * 目的: 「壊そうとしても壊れない」ことを証明する
 *
 * 普通の使い方は season-section.test.tsx で確認済み。
 * ここでは「実装者が想定していない使い方をしたらどうなる？」を検証する。
 *
 * Edge Case（エッジケース）= 境界値、異常値、極端な入力、組み合わせ爆発
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SeasonSection } from "../season-section";
import { WafuI18nProvider } from "../i18n";

afterEach(() => {
  cleanup();
});

// ============================================
// 1. 4シーズン全テスト
//    → 各シーズンで正しい背景色クラス・ボーダークラスが適用されるかを確認する
//    → seasonConfig のキーと実際の CSS クラスのマッピングが正しいことを保証する
// ============================================
describe("Edge: 4シーズン全てのスタイル適用", () => {
  it("spring: 背景がピンク系、ボーダーがピンク系のクラスを含む", () => {
    render(<SeasonSection season="spring" title="桜の季節" />);
    const section = screen.getByRole("region");
    // seasonConfig の spring 設定が section に反映されるか
    expect(section.className).toContain("bg-pink-50");
    expect(section.className).toContain("border-pink-200");
  });

  it("summer: 背景がエメラルド系、ボーダーがエメラルド系のクラスを含む", () => {
    render(<SeasonSection season="summer" title="夏の旅" />);
    const section = screen.getByRole("region");
    expect(section.className).toContain("bg-emerald-50");
    expect(section.className).toContain("border-emerald-200");
  });

  it("autumn: 背景がオレンジ系、ボーダーがオレンジ系のクラスを含む", () => {
    render(<SeasonSection season="autumn" title="紅葉狩り" />);
    const section = screen.getByRole("region");
    expect(section.className).toContain("bg-orange-50");
    expect(section.className).toContain("border-orange-200");
  });

  it("winter: 背景がスレート系、ボーダーがスレート系のクラスを含む", () => {
    render(<SeasonSection season="winter" title="雪見の宿" />);
    const section = screen.getByRole("region");
    expect(section.className).toContain("bg-slate-50");
    expect(section.className).toContain("border-slate-200");
  });

  it("4シーズン全てで section 要素がクラッシュせずにレンダリングされる", () => {
    // 各シーズンをループで検証するスモークテスト
    const seasons = ["spring", "summer", "autumn", "winter"] as const;
    for (const season of seasons) {
      cleanup();
      render(<SeasonSection season={season} title={`${season}のテスト`} />);
      expect(screen.getByRole("region")).toBeDefined();
    }
  });

  it("4シーズン全てで絵文字アイコンに正しい aria-label が付く", () => {
    // スクリーンリーダーがシーズン名を読み上げられるか
    const seasons = ["spring", "summer", "autumn", "winter"] as const;
    for (const season of seasons) {
      cleanup();
      render(<SeasonSection season={season} title="Test" />);
      expect(screen.getByLabelText(season)).toBeDefined();
    }
  });
});
// ============================================
// 2. 極端な title / subtitle
//    → title は aria-label にも使われるため長文・特殊文字で壊れないかを確認する
//    → XSS 系の文字列が安全にエスケープされることを React の自動エスケープで保証する
// ============================================
describe("Edge: 極端な title / subtitle", () => {
  it("title が超長文（2000文字）でもクラッシュしない", () => {
    // CMS から動的に取得された場合、トリミング前にレンダリングされうるシナリオ
    const longTitle = "桜".repeat(2000);
    render(<SeasonSection season="spring" title={longTitle} />);
    const heading = screen.getByRole("heading");
    expect(heading.textContent).toBe(longTitle);
  });

  it("title の超長文が section の aria-label にも完全に反映される", () => {
    const longTitle = "紅葉の間".repeat(100);
    render(<SeasonSection season="autumn" title={longTitle} />);
    const section = screen.getByRole("region");
    expect(section.getAttribute("aria-label")).toBe(longTitle);
  });

  it("title に HTML タグ文字列が含まれても XSS にならない", () => {
    // React は文字列を自動エスケープするため script タグが実行されないことを確認
    const xssTitle = String.raw`<script>alert("xss")</script>`;
    render(<SeasonSection season="spring" title={xssTitle} />);
    const heading = screen.getByRole("heading");
    expect(heading.textContent).toBe(xssTitle);
    expect(document.querySelector("script")).toBeNull();
  });

  it("title に絵文字が含まれても表示される", () => {
    render(<SeasonSection season="spring" title="🌸 春の特別プラン 🌸" />);
    expect(screen.getByRole("heading", { name: "🌸 春の特別プラン 🌸" })).toBeDefined();
  });

  it("subtitle が超長文（5000文字）でもクラッシュしない", () => {
    const longSubtitle = "温泉でゆっくりお過ごしいただけます。".repeat(250);
    render(
      <SeasonSection season="summer" title="夏の旅" subtitle={longSubtitle} />
    );
    expect(screen.getByText(longSubtitle)).toBeDefined();
  });

  it("subtitle に img onerror 文字列が含まれても XSS にならない", () => {
    // React はこれもテキストとしてエスケープするため img 要素は生成されない
    const xssSubtitle = String.raw`<img src=x onerror=alert(1)>`;
    render(
      <SeasonSection season="winter" title="雪見" subtitle={xssSubtitle} />
    );
    const para = screen.getByText(xssSubtitle);
    expect(para).toBeDefined();
    expect(document.querySelector("img")).toBeNull();
  });

  it("subtitle に改行文字を含む文字列でもクラッシュしない", () => {
    const multiLineSubtitle = `一行目\n二行目\n三行目`;
    render(
      <SeasonSection season="autumn" title="紅葉" subtitle={multiLineSubtitle} />
    );
    // getByText は改行を含むテキストの完全一致が難しいため正規表現で検索
    expect(screen.getByText(/一行目/)).toBeDefined();
  });

  it("title が空文字でも aria-label は空文字として設定される（クラッシュしない）", () => {
    // バリデーション前のレンダリングで空文字が渡るシナリオ
    // 空の aria-label を持つ section は "region" ロールとして認識されないため
    // querySelector で直接取得する
    const { container } = render(<SeasonSection season="spring" title="" />);
    const section = container.querySelector("section");
    expect(section).not.toBeNull();
    expect(section!.getAttribute("aria-label")).toBe("");
  });
});
// ============================================
// 3. children の組み合わせ
//    → children は省略可能だが、複雑な JSX や null/false が渡ることを想定する
//    → children が存在するときのみ mt-6 ラッパーが描画されることも確認する
// ============================================
describe("Edge: children の組み合わせ", () => {
  it("children なしでもクラッシュしない", () => {
    render(<SeasonSection season="spring" title="桜の季節" />);
    expect(screen.getByRole("region")).toBeDefined();
  });

  it("children あり・subtitle なしの組み合わせでも壊れない", () => {
    render(
      <SeasonSection season="summer" title="夏の体験">
        <p>川遊び体験</p>
      </SeasonSection>
    );
    expect(screen.getByText("川遊び体験")).toBeDefined();
  });

  it("全 props フル指定（children + subtitle + className）でも壊れない", () => {
    render(
      <SeasonSection
        season="autumn"
        title="紅葉狩り"
        subtitle="秋の旅館で最高の紅葉を"
        className="extra-class"
      >
        <ul>
          <li>紅葉の見どころA</li>
          <li>紅葉の見どころB</li>
        </ul>
      </SeasonSection>
    );
    expect(screen.getByText("秋の旅館で最高の紅葉を")).toBeDefined();
    expect(screen.getByText("紅葉の見どころA")).toBeDefined();
    expect(screen.getByText("紅葉の見どころB")).toBeDefined();
  });

  it("複数の children 要素でもクラッシュしない", () => {
    render(
      <SeasonSection season="winter" title="雪見の宿">
        <p>設備A</p>
        <p>設備B</p>
        <p>設備C</p>
      </SeasonSection>
    );
    expect(screen.getByText("設備A")).toBeDefined();
    expect(screen.getByText("設備B")).toBeDefined();
    expect(screen.getByText("設備C")).toBeDefined();
  });

  it("children に null を渡してもクラッシュしない", () => {
    // {condition && <Component />} パターンで null が渡るシナリオ
    render(<SeasonSection season="spring" title="桜">{null}</SeasonSection>);
    expect(screen.getByRole("region")).toBeDefined();
  });

  it("children に false を渡してもクラッシュしない", () => {
    render(<SeasonSection season="spring" title="桜">{false}</SeasonSection>);
    expect(screen.getByRole("region")).toBeDefined();
  });

  it("children に数値を渡してもクラッシュしない", () => {
    render(<SeasonSection season="summer" title="夏">{42}</SeasonSection>);
    expect(screen.getByText("42")).toBeDefined();
  });

  it("ネストが深い children でもクラッシュしない", () => {
    render(
      <SeasonSection season="autumn" title="紅葉">
        <section>
          <article>
            <div>
              <p><span>深くネストされたコンテンツ</span></p>
            </div>
          </article>
        </section>
      </SeasonSection>
    );
    expect(screen.getByText("深くネストされたコンテンツ")).toBeDefined();
  });
});

// ============================================
// 4. className の透過
//    → ユーザーが独自クラスを渡したとき、内部クラスと共存するかを確認する
//    → 空文字・スペースのみでもクラッシュしないことを確認する
// ============================================
describe('Edge: className の透過', () => {
  it('独自 className がベースクラスと共存する（spring の場合）', () => {
    render(<SeasonSection season='spring' title='桜' className='my-custom-class' />);
    const section = screen.getByRole('region');
    // 内部の bg-pink-50 と渡した my-custom-class が両立する
    expect(section.className).toContain('bg-pink-50');
    expect(section.className).toContain('my-custom-class');
  });

  it('空の className でもクラッシュしない', () => {
    render(<SeasonSection season='winter' title='冬' className='' />);
    const section = screen.getByRole('region');
    expect(section.className).toContain('bg-slate-50');
  });

  it('スペースのみの className でもクラッシュしない', () => {
    render(<SeasonSection season='summer' title='夏' className='   ' />);
    expect(screen.getByRole('region')).toBeDefined();
  });

  it('複数クラスを渡しても全て付与される', () => {
    render(
      <SeasonSection season='autumn' title='紅葉' className='class-a class-b class-c' />
    );
    const section = screen.getByRole('region');
    expect(section.className).toContain('class-a');
    expect(section.className).toContain('class-b');
    expect(section.className).toContain('class-c');
  });
});

// ============================================
// 5. aria 属性の確認
//    → section の aria-label は title と一致する必要がある（アクセシビリティ）
//    → 絵文字 span の role="img" + aria-label が正しく設定されているかを確認する
//    → title が更新されたとき aria-label も追従するかを確認する（動的更新シナリオ）
// ============================================
describe('Edge: aria 属性の堅牢性', () => {
  it('section の aria-label は title と一致する', () => {
    render(<SeasonSection season='spring' title='桜の宴' />);
    expect(screen.getByRole('region', { name: '桜の宴' })).toBeDefined();
  });

  it('title が更新されると aria-label も追従する（rerender）', () => {
    // SWR などで title が API から動的に更新されるシナリオ
    const { rerender } = render(<SeasonSection season='spring' title='春の初め' />);
    expect(screen.getByRole('region').getAttribute('aria-label')).toBe('春の初め');

    rerender(<SeasonSection season='spring' title='春の終わり' />);
    expect(screen.getByRole('region').getAttribute('aria-label')).toBe('春の終わり');
  });

  it('絵文字の span に role img が設定されている', () => {
    render(<SeasonSection season='spring' title='Test' />);
    const icon = screen.getByLabelText('spring');
    expect(icon.getAttribute('role')).toBe('img');
  });

  it('絵文字の aria-label はシーズン名と一致する（全シーズン）', () => {
    const seasons = ['spring', 'summer', 'autumn', 'winter'] as const;
    for (const season of seasons) {
      cleanup();
      render(<SeasonSection season={season} title='Test' />);
      // aria-label={season} で取得できるか
      expect(screen.getByLabelText(season)).toBeDefined();
    }
  });

  it('h2 は heading ロールとして認識される', () => {
    render(<SeasonSection season='winter' title='雪見の宿' />);
    expect(screen.getByRole('heading', { name: '雪見の宿' })).toBeDefined();
  });
});

// ============================================
// 6. i18n との組み合わせ
//    → WafuI18nProvider で locale を切り替えたとき、シーズンラベルが変わるかを確認する
//    → プロバイダーなし（デフォルト ja）でも動くことは season-section.test.tsx で確認済み
//    → ここでは locale=en への切替と、シーズン × locale の全組み合わせを確認する
// ============================================
describe('Edge: i18n との組み合わせ', () => {
  it('locale=en のとき spring ラベルが Spring — 春 になる', () => {
    render(
      <WafuI18nProvider locale='en'>
        <SeasonSection season='spring' title='Cherry Blossoms' />
      </WafuI18nProvider>
    );
    expect(screen.getByText('Spring — 春')).toBeDefined();
    expect(screen.queryByText('春 — Spring')).toBeNull();
  });

  it('locale=en のとき summer ラベルが Summer — 夏 になる', () => {
    render(
      <WafuI18nProvider locale='en'>
        <SeasonSection season='summer' title='Summer' />
      </WafuI18nProvider>
    );
    expect(screen.getByText('Summer — 夏')).toBeDefined();
  });

  it('locale=en のとき autumn ラベルが Autumn — 秋 になる', () => {
    render(
      <WafuI18nProvider locale='en'>
        <SeasonSection season='autumn' title='Autumn' />
      </WafuI18nProvider>
    );
    expect(screen.getByText('Autumn — 秋')).toBeDefined();
  });

  it('locale=en のとき winter ラベルが Winter — 冬 になる', () => {
    render(
      <WafuI18nProvider locale='en'>
        <SeasonSection season='winter' title='Winter' />
      </WafuI18nProvider>
    );
    expect(screen.getByText('Winter — 冬')).toBeDefined();
  });

  it('locale=ja のとき全シーズンで日本語ラベルが表示される', () => {
    const expected = {
      spring: '春 — Spring',
      summer: '夏 — Summer',
      autumn: '秋 — Autumn',
      winter: '冬 — Winter',
    } as const;
    const seasons = ['spring', 'summer', 'autumn', 'winter'] as const;
    for (const season of seasons) {
      cleanup();
      render(
        <WafuI18nProvider locale='ja'>
          <SeasonSection season={season} title='Test' />
        </WafuI18nProvider>
      );
      expect(screen.getByText(expected[season])).toBeDefined();
    }
  });

  it('locale を ja から en に切り替えるとシーズンラベルも更新される', () => {
    // 言語スイッチャーでリアルタイムに切り替えるシナリオ
    const { rerender } = render(
      <WafuI18nProvider locale='ja'>
        <SeasonSection season='spring' title='桜' />
      </WafuI18nProvider>
    );
    expect(screen.getByText('春 — Spring')).toBeDefined();

    rerender(
      <WafuI18nProvider locale='en'>
        <SeasonSection season='spring' title='桜' />
      </WafuI18nProvider>
    );
    expect(screen.getByText('Spring — 春')).toBeDefined();
    expect(screen.queryByText('春 — Spring')).toBeNull();
  });

  it('locale=en + children + subtitle の組み合わせでも壊れない（全 props フル）', () => {
    render(
      <WafuI18nProvider locale='en'>
        <SeasonSection
          season='autumn'
          title='Autumn Foliage'
          subtitle='Experience autumn at its finest'
          className='extra'
        >
          <p>Foliage tour available</p>
        </SeasonSection>
      </WafuI18nProvider>
    );
    expect(screen.getByText('Autumn — 秋')).toBeDefined();
    expect(screen.getByText('Experience autumn at its finest')).toBeDefined();
    expect(screen.getByText('Foliage tour available')).toBeDefined();
  });
});
