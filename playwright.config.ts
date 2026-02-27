import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  retries: 0,
  use: {
    // Storybook のローカルサーバーに接続
    baseURL: "http://localhost:6006",
    // ヘッドレスモード（画面を表示しない）
    headless: true,
    // スクショ・動画を失敗時に自動保存
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  // Storybook を自動起動してテスト後に停止
  webServer: {
    command: "npm run storybook -- --no-open",
    port: 6006,
    timeout: 60000,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
