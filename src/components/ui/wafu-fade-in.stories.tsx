import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WafuFadeIn } from "./wafu-fade-in";
import { WafuButton } from "./wafu-button";

const meta = {
  title: "UI/WafuFadeIn",
  component: WafuFadeIn,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "wafu",
      values: [{ name: "wafu", value: "#F5F5F0" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["up", "down", "left", "right", "none"],
      description: "フェードインの方向",
    },
    delay: {
      control: { type: "number", min: 0, max: 2000, step: 100 },
      description: "遅延時間 (ms)",
    },
    duration: {
      control: { type: "number", min: 100, max: 2000, step: 100 },
      description: "アニメーション時間 (ms)",
    },
  },
} satisfies Meta<typeof WafuFadeIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FadeUp: Story = {
  args: {
    direction: "up",
    children: (
      <div className="p-6 bg-wafu-bg-card border border-wafu-border rounded-sm">
        <h3 className="font-serif-jp text-lg font-semibold mb-2">ふわっと登場</h3>
        <p className="text-sm text-wafu-text-secondary">
          スクロールすると下から静かにフェードインします。
        </p>
      </div>
    ),
  },
};

export const FadeLeft: Story = {
  args: {
    direction: "left",
    children: (
      <WafuButton variant="momiji" size="lg">
        左からフェードイン
      </WafuButton>
    ),
  },
};

export const Staggered: Story = {
  args: {
    direction: "up",
    children: "段階的フェードイン",
  },
  render: () => (
    <div className="space-y-4">
      {["藍", "紅葉", "琥珀", "竹"].map((name, i) => (
        <WafuFadeIn key={name} direction="up" delay={i * 150}>
          <div className="p-4 bg-wafu-bg-card border border-wafu-border rounded-sm">
            <span className="font-serif-jp">{name}</span>
          </div>
        </WafuFadeIn>
      ))}
    </div>
  ),
};
