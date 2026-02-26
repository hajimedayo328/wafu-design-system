import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WafuDivider } from "./wafu-divider";

const meta = {
  title: "UI/WafuDivider",
  component: WafuDivider,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "wafu",
      values: [{ name: "wafu", value: "#F5F5F0" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["line", "dots", "wave"],
      description: "区切り線のスタイル",
    },
  },
} satisfies Meta<typeof WafuDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  args: { variant: "line" },
};

export const Dots: Story = {
  args: { variant: "dots" },
};

export const Wave: Story = {
  args: { variant: "wave" },
};
