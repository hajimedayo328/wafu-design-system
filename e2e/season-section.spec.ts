/**
 * SeasonSection - E2E テスト
 *
 * 四季セクションが実際のブラウザで色・アイコン付きで表示されることを確認する。
 */
import { test, expect } from "@playwright/test";

const storyUrl = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

test.describe("SeasonSection E2E", () => {
  test("春セクションが桜アイコン付きで表示される", async ({ page }) => {
    await page.goto(storyUrl("ui-seasonsection--spring"));
    const section = page.getByRole("region");
    await expect(section).toBeVisible();
    // 桜の絵文字が見える
    await expect(page.getByText("🌸")).toBeVisible();
  });

  test("4シーズン全てが表示できる", async ({ page }) => {
    const seasons = [
      { id: "spring", icon: "🌸" },
      { id: "summer", icon: "🎋" },
      { id: "autumn", icon: "🍁" },
      { id: "winter", icon: "❄️" },
    ];
    for (const season of seasons) {
      await page.goto(
        storyUrl(`ui-seasonsection--${season.id}`)
      );
      await expect(page.getByRole("region")).toBeVisible();
      await expect(page.getByText(season.icon)).toBeVisible();
    }
  });

  test("セクションの背景色が実際に描画されている", async ({ page }) => {
    await page.goto(storyUrl("ui-seasonsection--autumn"));
    const section = page.getByRole("region");
    const bgColor = await section.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );
    // bg-orange-50 が何らかの色として描画されている（transparent でない）
    expect(bgColor).not.toBe("rgba(0, 0, 0, 0)");
  });
});
