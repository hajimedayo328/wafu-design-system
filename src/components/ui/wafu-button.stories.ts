import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WafuButton } from "./wafu-button";

const meta = {
  title: "UI/WafuButton",
  component: WafuButton,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "wafu",
      values: [
        { name: "wafu", value: "#F5F5F0" },
        { name: "white", value: "#FFFFFF" },
        { name: "dark", value: "#333333" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["ai", "momiji", "kohaku", "take", "ghost", "outline"],
      description: "ボタンのスタイルバリアント",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "ボタンのサイズ",
    },
    disabled: {
      control: "boolean",
      description: "無効状態",
    },
    children: {
      control: "text",
      description: "ボタンのテキスト",
    },
  },
} satisfies Meta<typeof WafuButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ai: Story = {
  args: { variant: "ai", children: "藍 (Ai)" },
};

export const Momiji: Story = {
  args: { variant: "momiji", children: "紅葉 (Momiji)" },
};

export const Kohaku: Story = {
  args: { variant: "kohaku", children: "琥珀 (Kohaku)" },
};

export const Take: Story = {
  args: { variant: "take", children: "竹 (Take)" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};

export const Small: Story = {
  args: { variant: "ai", size: "sm", children: "Small" },
};

export const Large: Story = {
  args: { variant: "ai", size: "lg", children: "Large" },
};

export const Disabled: Story = {
  args: { variant: "ai", children: "無効", disabled: true },
};

export const BookingExample: Story = {
  args: { variant: "ai", size: "sm", children: "予約する" },
  parameters: {
    docs: {
      description: {
        story: "旅館の予約ボタンとしての使用例",
      },
    },
  },
};
