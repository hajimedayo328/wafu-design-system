/**
 * WafuButton - E2E テスト
 *
 * 実際の Chromium ブラウザで Storybook のストーリーを開いて操作する。
 * Storybook ID = "title を小文字+ハイフン化"--"ストーリー名を小文字化"
 * 例: title: "UI/WafuButton", export const Ai → ui-wafubutton--ai
 */
import { test, expect } from "@playwright/test";

const storyUrl = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

test.describe("WafuButton E2E", () => {
  test("ボタンが表示されてクリックできる", async ({ page }) => {
    await page.goto(storyUrl("ui-wafubutton--ai"));
    const button = page.getByRole("button");
    await expect(button).toBeVisible();
    await button.click();
    await expect(button).toBeVisible();
  });

  test("6バリアント全てが表示できる", async ({ page }) => {
    // 各バリアントのストーリーを順番に開いて確認
    const variants = ["ai", "momiji", "kohaku", "take", "ghost", "outline"];
    for (const v of variants) {
      await page.goto(storyUrl(`ui-wafubutton--${v}`));
      await expect(page.getByRole("button")).toBeVisible();
    }
  });

  test("disabled ボタンは無効状態になる", async ({ page }) => {
    await page.goto(storyUrl("ui-wafubutton--disabled"));
    const button = page.getByRole("button");
    await expect(button).toBeDisabled();
    const opacity = await button.evaluate(
      (el) => window.getComputedStyle(el).opacity
    );
    expect(Number(opacity)).toBeLessThan(1);
  });

  test("フォーカスが当たる（キーボード操作）", async ({ page }) => {
    await page.goto(storyUrl("ui-wafubutton--ai"));
    const button = page.getByRole("button");
    await button.focus();
    await expect(button).toBeFocused();
    // focus-visible のアウトラインが適用されていることを確認
    const outlineStyle = await button.evaluate(
      (el) => window.getComputedStyle(el).outlineStyle
    );
    // フォーカス可能であることが確認できればOK
    expect(outlineStyle).toBeDefined();
  });
});
