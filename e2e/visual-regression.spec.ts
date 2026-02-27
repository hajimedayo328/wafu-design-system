/**
 * Visual Regression テスト
 *
 * 全コンポーネントのスクリーンショットを撮影し、前回と比較する。
 * 初回実行時はベースラインを生成。2回目以降はピクセル単位で差分検出。
 *
 * ベースライン更新: npx playwright test --update-snapshots
 */
import { test, expect } from "@playwright/test";

const storyUrl = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

// ────────────────────────────────────────
// WafuButton
// ────────────────────────────────────────
test.describe("Visual: WafuButton", () => {
  const variants = ["ai", "momiji", "kohaku", "take", "ghost", "outline"];

  for (const v of variants) {
    test(`${v} バリアント`, async ({ page }) => {
      await page.goto(storyUrl(`ui-wafubutton--${v}`));
      await page.waitForLoadState("networkidle");
      await expect(page.getByRole("button")).toHaveScreenshot(
        `wafu-button-${v}.png`
      );
    });
  }

  test("disabled 状態", async ({ page }) => {
    await page.goto(storyUrl("ui-wafubutton--disabled"));
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button")).toHaveScreenshot(
      "wafu-button-disabled.png"
    );
  });

  test("small サイズ", async ({ page }) => {
    await page.goto(storyUrl("ui-wafubutton--small"));
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button")).toHaveScreenshot(
      "wafu-button-small.png"
    );
  });

  test("large サイズ", async ({ page }) => {
    await page.goto(storyUrl("ui-wafubutton--large"));
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button")).toHaveScreenshot(
      "wafu-button-large.png"
    );
  });
});

// ────────────────────────────────────────
// RyokanCard
// ────────────────────────────────────────
test.describe("Visual: RyokanCard", () => {
  test("default カード", async ({ page }) => {
    await page.goto(storyUrl("ui-ryokancard--default"));
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("article")).toHaveScreenshot(
      "ryokan-card-default.png"
    );
  });

  test("featured カード", async ({ page }) => {
    await page.goto(storyUrl("ui-ryokancard--featured"));
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("article")).toHaveScreenshot(
      "ryokan-card-featured.png"
    );
  });
});

// ────────────────────────────────────────
// SeasonSection
// ────────────────────────────────────────
test.describe("Visual: SeasonSection", () => {
  const seasons = ["spring", "summer", "autumn", "winter"];

  for (const s of seasons) {
    test(`${s} セクション`, async ({ page }) => {
      await page.goto(storyUrl(`ui-seasonsection--${s}`));
      await page.waitForLoadState("networkidle");
      await expect(page.getByRole("region")).toHaveScreenshot(
        `season-section-${s}.png`
      );
    });
  }
});

// ────────────────────────────────────────
// WafuDivider
// ────────────────────────────────────────
test.describe("Visual: WafuDivider", () => {
  const variants = ["line", "dots", "wave"];

  for (const v of variants) {
    test(`${v} バリアント`, async ({ page }) => {
      await page.goto(storyUrl(`ui-wafudivider--${v}`));
      await page.waitForLoadState("networkidle");
      await expect(page.getByRole("separator")).toHaveScreenshot(
        `wafu-divider-${v}.png`
      );
    });
  }
});
