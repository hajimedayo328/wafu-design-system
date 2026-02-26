import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RyokanCard } from "./ryokan-card";

const meta = {
  title: "UI/RyokanCard",
  component: RyokanCard,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "wafu",
      values: [{ name: "wafu", value: "#F5F5F0" }],
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RyokanCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    roomName: "紅葉の間",
    roomType: "特別室",
    description: "四季折々の庭園を望む特別室。檜風呂付きの贅沢な空間で、心安らぐひとときをお過ごしください。",
    price: "¥48,000",
  },
};

export const Featured: Story = {
  args: {
    roomName: "桜の間",
    roomType: "スイート",
    description: "桜の木を眺める最上階の特別スイート。専用露天風呂から四季の移ろいをお楽しみいただけます。",
    price: "¥78,000",
    variant: "featured",
  },
};

export const Budget: Story = {
  args: {
    roomName: "竹の間",
    roomType: "和室",
    description: "落ち着いた佇まいの8畳和室。窓から竹林を望む静寂な空間です。",
    price: "¥22,000",
    ctaLabel: "空室を確認",
  },
};
