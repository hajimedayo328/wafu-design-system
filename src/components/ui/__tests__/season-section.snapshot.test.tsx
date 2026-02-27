/**
 * SeasonSection - Snapshot テスト
 *
 * 4シーズンそれぞれで背景色・アイコン・ボーダーが異なるため、
 * 全シーズンのスナップショットを取る。
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { SeasonSection } from "../season-section";
import { WafuI18nProvider } from "../i18n";

afterEach(() => {
  cleanup();
});

describe("SeasonSection Snapshots", () => {
  // 4シーズン全て記録
  it.each([
    ["spring", "桜の季節"],
    ["summer", "涼風の夏"],
    ["autumn", "紅葉狩り"],
    ["winter", "雪見の宿"],
  ] as const)("season=%s のHTML構造", (season, title) => {
    const { container } = render(
      <SeasonSection season={season} title={title} />
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("subtitle + children 付き", () => {
    const { container } = render(
      <SeasonSection season="autumn" title="紅葉狩り" subtitle="色づく山々">
        <p>テスト子要素</p>
      </SeasonSection>
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("英語ロケール", () => {
    const { container } = render(
      <WafuI18nProvider locale="en">
        <SeasonSection season="spring" title="Cherry Blossoms" />
      </WafuI18nProvider>
    );
    expect(container.innerHTML).toMatchSnapshot();
  });
});
