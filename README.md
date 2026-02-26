# wafu-design-system

Japanese-style (和風) UI component library built with React, TypeScript, and Tailwind CSS.

Inspired by traditional Japanese aesthetics — ryokan, onsen, autumn leaves, and bamboo.

## Installation

```bash
npm install wafu-design-system
```

```tsx
import { WafuButton, RyokanCard, SeasonSection } from "wafu-design-system";
import "wafu-design-system/styles"; // Optional: wafu color tokens
```

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
<WafuButton variant="ai" size="md">予約する</WafuButton>
<WafuButton variant="momiji">紅葉を見る</WafuButton>
```

**Variants:** `ai` · `momiji` · `kohaku` · `take` · `ghost` · `outline`

### RyokanCard

Room card with image, pricing, and booking CTA.

```tsx
<RyokanCard
  roomName="紅葉の間"
  roomType="特別室"
  description="四季折々の庭園を望む特別室。"
  price="¥48,000"
  variant="featured"
/>
```

### SeasonSection

Seasonal themed section (spring/summer/autumn/winter).

```tsx
<SeasonSection season="autumn" title="紅葉狩り" subtitle="山々が赤く染まる秋。">
  <p>Your content here</p>
</SeasonSection>
```

### WafuFadeIn

Scroll-triggered fade-in animation.

```tsx
<WafuFadeIn direction="up" delay={200}>
  <p>ふわっと登場</p>
</WafuFadeIn>
```

**Directions:** `up` · `down` · `left` · `right` · `none`

### WafuDivider

Japanese-style section separator.

```tsx
<WafuDivider variant="dots" />
<WafuDivider variant="wave" />
```

**Variants:** `line` · `dots` · `wave`

## i18n

Wrap your app with `WafuI18nProvider` to switch between Japanese and English.

```tsx
import { WafuI18nProvider } from "wafu-design-system";

<WafuI18nProvider locale="en">
  <RyokanCard ... /> {/* "Book Now" instead of "予約する" */}
</WafuI18nProvider>
```

## Testing

47 unit tests covering all components.

```bash
npm test              # Run unit tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

## Tech Stack

- **React 19** + TypeScript
- **Tailwind CSS** (CSS variables)
- **Storybook 10** (component catalog + autodocs)
- **Vitest** + Testing Library (47 unit tests)
- **tsup** (ESM/CJS/DTS library build)
- **GitHub Actions** (CI + CD: auto-publish to npm on release)

## Development

```bash
npm install
npm run dev          # Next.js dev server
npx storybook dev    # Storybook dev server
npm test             # Run tests
npm run build:lib    # Build npm package
```

## Roadmap

- [x] Color system (CSS variables + Tailwind)
- [x] WafuButton (6 variants, 3 sizes)
- [x] RyokanCard (default + featured)
- [x] SeasonSection (spring/summer/autumn/winter)
- [x] WafuFadeIn (scroll animation)
- [x] WafuDivider (line/dots/wave)
- [x] Storybook integration
- [x] GitHub Actions CI/CD
- [x] Unit tests (47 tests)
- [x] Accessibility (WAI-ARIA)
- [x] i18n (ja/en)
- [x] npm package build (tsup)
- [ ] Visual regression testing
- [ ] Dark theme
- [ ] Canvas/WebGL wafu effects

## License

MIT
