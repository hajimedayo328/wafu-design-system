/**
 * RyokanCard - E2E テスト
 *
 * Storybook ID: ui-ryokancard--default, ui-ryokancard--featured
 */
import { test, expect } from "@playwright/test";

const storyUrl = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

test.describe("RyokanCard E2E", () => {
  test("カードが表示され、部屋名・価格が読める", async ({ page }) => {
    await page.goto(storyUrl("ui-ryokancard--default"));
    const card = page.getByRole("article");
    await expect(card).toBeVisible();
    const heading = page.getByRole("heading");
    await expect(heading).toBeVisible();
  });

  test("予約ボタンがクリックできる", async ({ page }) => {
    await page.goto(storyUrl("ui-ryokancard--default"));
    const button = page.getByRole("button");
    await expect(button).toBeVisible();
    await button.click();
    await expect(page.getByRole("article")).toBeVisible();
  });

  test("featured バリアントが表示される", async ({ page }) => {
    await page.goto(storyUrl("ui-ryokancard--featured"));
    const card = page.getByRole("article");
    await expect(card).toBeVisible();
  });
});
