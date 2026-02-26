import { WafuButton } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-wafu-bg p-12">
      <div className="mx-auto max-w-3xl space-y-12">
        <header className="space-y-2">
          <h1 className="font-serif-jp text-3xl font-bold text-wafu-text-primary">
            和風デザインシステム
          </h1>
          <p className="text-wafu-text-secondary">
            Wafu Design System — Japanese-style UI components
          </p>
        </header>

        {/* Variants */}
        <section className="space-y-4">
          <h2 className="font-serif-jp text-xl font-semibold text-wafu-text-primary border-b border-wafu-border pb-2">
            WafuButton — バリアント
          </h2>
          <div className="flex flex-wrap gap-3">
            <WafuButton variant="ai">藍 (Ai)</WafuButton>
            <WafuButton variant="momiji">紅葉 (Momiji)</WafuButton>
            <WafuButton variant="kohaku">琥珀 (Kohaku)</WafuButton>
            <WafuButton variant="take">竹 (Take)</WafuButton>
            <WafuButton variant="ghost">Ghost</WafuButton>
            <WafuButton variant="outline">Outline</WafuButton>
          </div>
        </section>

        {/* Sizes */}
        <section className="space-y-4">
          <h2 className="font-serif-jp text-xl font-semibold text-wafu-text-primary border-b border-wafu-border pb-2">
            WafuButton — サイズ
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <WafuButton size="sm">Small</WafuButton>
            <WafuButton size="md">Medium</WafuButton>
            <WafuButton size="lg">Large</WafuButton>
          </div>
        </section>

        {/* Disabled */}
        <section className="space-y-4">
          <h2 className="font-serif-jp text-xl font-semibold text-wafu-text-primary border-b border-wafu-border pb-2">
            WafuButton — 無効状態
          </h2>
          <div className="flex flex-wrap gap-3">
            <WafuButton disabled>Disabled</WafuButton>
            <WafuButton variant="momiji" disabled>Disabled</WafuButton>
            <WafuButton variant="outline" disabled>Disabled</WafuButton>
          </div>
        </section>

        {/* Example: Card with Button */}
        <section className="space-y-4">
          <h2 className="font-serif-jp text-xl font-semibold text-wafu-text-primary border-b border-wafu-border pb-2">
            使用例 — 旅館カード
          </h2>
          <div className="rounded-sm border border-wafu-border bg-wafu-bg-card p-6 space-y-4 max-w-sm">
            <div className="h-40 rounded-sm bg-wafu-bg-warm" />
            <span className="text-xs font-semibold tracking-widest text-wafu-momiji">
              特別室
            </span>
            <h3 className="font-serif-jp text-xl font-semibold text-wafu-text-primary">
              紅葉の間
            </h3>
            <p className="text-sm text-wafu-text-secondary leading-relaxed">
              四季折々の庭園を望む特別室。檜風呂付きの贅沢な空間。
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-wafu-border">
              <div>
                <span className="font-serif-jp text-lg font-semibold text-wafu-text-primary">¥48,000</span>
                <span className="text-xs text-wafu-text-muted ml-1">/ 一泊</span>
              </div>
              <WafuButton size="sm">予約する</WafuButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
