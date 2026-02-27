/**
 * RyokanCard - Snapshot テスト
 *
 * RyokanCard は props が多いので、代表的な組み合わせを記録する。
 * 画像URL、価格、説明文などの動的テキストは固定値で統一し、
 * HTML構造の変化だけを検出する。
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { RyokanCard } from "../ryokan-card";
import { WafuI18nProvider } from "../i18n";

afterEach(() => {
  cleanup();
});

describe("RyokanCard Snapshots", () => {
  it("default バリアント（最小 props）", () => {
    const { container } = render(
      <RyokanCard roomName="桜の間" price="¥25,000" />
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("featured バリアント", () => {
    const { container } = render(
      <RyokanCard roomName="桜の間" price="¥25,000" featured />
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("全 props 指定", () => {
    const { container } = render(
      <RyokanCard
        roomName="桜の間"
        price="¥25,000"
        description="庭園を望む落ち着いた和室"
        imageSrc="/images/sakura.jpg"
        featured
        ctaLabel="空室を確認"
        priceUnit="/泊"
      />
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("英語ロケール", () => {
    const { container } = render(
      <WafuI18nProvider locale="en">
        <RyokanCard roomName="Sakura Room" price="$250" />
      </WafuI18nProvider>
    );
    expect(container.innerHTML).toMatchSnapshot();
  });
});
