# wafu-design-system

Japanese-style (和風) UI component library built with Next.js, TypeScript, and Tailwind CSS.

Inspired by traditional Japanese aesthetics — ryokan, onsen, autumn leaves, and bamboo.

## Color System

| Name | Hex | Inspiration |
|------|-----|-------------|
| **Ai (藍)** | `#2B3C5E` | Indigo dye |
| **Momiji (紅葉)** | `#C53D43` | Autumn leaves |
| **Kohaku (琥珀)** | `#C47222` | Amber |
| **Take (竹)** | `#5B8930` | Bamboo |

## Components

### WafuButton

6 variants × 3 sizes with full accessibility support.

```tsx
import { WafuButton } from "@/components/ui";

<WafuButton variant="ai" size="md">予約する</WafuButton>
<WafuButton variant="momiji">紅葉を見る</WafuButton>
<WafuButton variant="outline" size="lg">詳細を見る</WafuButton>
```

**Variants:** `ai` · `momiji` · `kohaku` · `take` · `ghost` · `outline`

**Sizes:** `sm` · `md` · `lg`

## Tech Stack

- **Next.js 16** + TypeScript
- **Tailwind CSS** (CSS variables)
- **Storybook** (component catalog + docs)
- **GitHub Actions** (CI: lint, build, storybook build)

## Getting Started

```bash
npm install
npm run dev          # Next.js dev server
npx storybook dev    # Storybook dev server
```

## Roadmap

- [x] Color system (CSS variables + Tailwind)
- [x] WafuButton (6 variants, 3 sizes)
- [x] Storybook integration
- [x] GitHub Actions CI
- [ ] RyokanCard component
- [ ] SeasonSection component
- [ ] Season themes (春桜 / 夏竹 / 秋紅葉 / 冬雪)
- [ ] Visual regression testing
- [ ] npm package publishing
- [ ] Accessibility (WAI-ARIA) audit
- [ ] i18n support

## License

MIT
