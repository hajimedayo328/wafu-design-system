/**
 * WafuDivider - E2E テスト
 *
 * セクション区切りが実際のブラウザで表示されることを確認する。
 */
import { test, expect } from "@playwright/test";

const storyUrl = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

test.describe("WafuDivider E2E", () => {
  test("line バリアントが水平線として表示される", async ({ page }) => {
    await page.goto(storyUrl("ui-wafudivider--line"));
    const separator = page.getByRole("separator");
    await expect(separator).toBeVisible();
  });

  test("dots バリアントが表示される", async ({ page }) => {
    await page.goto(storyUrl("ui-wafudivider--dots"));
    const separator = page.getByRole("separator");
    await expect(separator).toBeVisible();
  });

  test("wave バリアントが表示される", async ({ page }) => {
    await page.goto(storyUrl("ui-wafudivider--wave"));
    const separator = page.getByRole("separator");
    await expect(separator).toBeVisible();
  });
});
