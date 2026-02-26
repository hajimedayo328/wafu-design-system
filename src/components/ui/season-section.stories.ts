import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SeasonSection } from "./season-section";

const meta = {
  title: "UI/SeasonSection",
  component: SeasonSection,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "wafu",
      values: [{ name: "wafu", value: "#F5F5F0" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    season: {
      control: "select",
      options: ["spring", "summer", "autumn", "winter"],
      description: "季節",
    },
  },
} satisfies Meta<typeof SeasonSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spring: Story = {
  args: {
    season: "spring",
    title: "桜の季節",
    subtitle: "庭園の枝垂れ桜が満開を迎え、淡いピンク色が館内を彩ります。春限定の桜会席もお楽しみいただけます。",
  },
};

export const Summer: Story = {
  args: {
    season: "summer",
    title: "涼風の候",
    subtitle: "竹林を渡る風が心地よい夏の旅館。川床料理と花火大会をお楽しみください。",
  },
};

export const Autumn: Story = {
  args: {
    season: "autumn",
    title: "紅葉狩り",
    subtitle: "山々が赤く染まる秋。露天風呂から望む紅葉は格別の美しさです。",
  },
};

export const Winter: Story = {
  args: {
    season: "winter",
    title: "雪見の宿",
    subtitle: "しんしんと降る雪を眺めながらの温泉。冬限定のかに会席とともに。",
  },
};
