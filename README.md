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

### RyokanCard

Room card with image, pricing, and booking CTA. Supports `default` and `featured` variants.

```tsx
import { RyokanCard } from "@/components/ui";

<RyokanCard
  roomName="紅葉の間"
  roomType="特別室"
  description="四季折々の庭園を望む特別室。"
  price="¥48,000"
  variant="featured"
  onCtaClick={() => console.log("予約")}
/>
```

### SeasonSection

Seasonal themed section with spring/summer/autumn/winter styles.

```tsx
import { SeasonSection } from "@/components/ui";

<SeasonSection season="autumn" title="紅葉狩り" subtitle="山々が赤く染まる秋。">
  <p>Your content here</p>
</SeasonSection>
```

**Seasons:** `spring` 🌸 · `summer` 🎋 · `autumn` 🍁 · `winter` ❄️

## Testing

26 unit tests covering all components (WafuButton, RyokanCard, SeasonSection).

```bash
npm test              # Run unit tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

## Tech Stack

- **Next.js 16** + TypeScript
- **Tailwind CSS** (CSS variables)
- **Storybook** (component catalog + docs)
- **Vitest** + Testing Library (unit tests)
- **GitHub Actions** (CI: lint, build, storybook build)

## Getting Started

```bash
npm install
npm run dev          # Next.js dev server
npx storybook dev    # Storybook dev server
npm test             # Run tests
```

## Roadmap

- [x] Color system (CSS variables + Tailwind)
- [x] WafuButton (6 variants, 3 sizes)
- [x] RyokanCard (default + featured)
- [x] SeasonSection (spring/summer/autumn/winter)
- [x] Storybook integration
- [x] GitHub Actions CI
- [x] Unit tests (26 tests)
- [x] Accessibility (WAI-ARIA attributes)
- [ ] Visual regression testing
- [ ] npm package publishing
- [ ] Wafu animations (scroll, fade)
- [ ] i18n support

## License

MIT
