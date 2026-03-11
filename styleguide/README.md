# Styleguide

Design system components integrated directly into gp-webapp, built on **shadcn/ui** and styled to match our **Figma Design System**.

---

## Quick Start

```tsx
// Import components
import { Button, Card, Input } from '@/styleguide'

// Import utilities
import { cn } from '@/styleguide/lib/utils'
```

---

## File Structure

```
styleguide/
├── components/ui/         # React components (Button, Card, Input, etc.)
├── stories/               # Storybook stories
├── lib/utils.ts           # cn() utility
├── design-tokens.css      # Raw Figma token values (CSS variables)
├── tailwind-theme.css     # Single @theme block for Tailwind v4
├── styleguide-scope.css   # [data-slot] variable overrides
├── typography.css         # Typography utilities
└── index.ts               # Re-exports for components
```

### Key Files

| File                   | Purpose                                               | When to Edit                     |
| ---------------------- | ----------------------------------------------------- | -------------------------------- |
| `design-tokens.css`    | Raw Figma tokens (colors, spacing, typography)        | Sync when Figma changes          |
| `tailwind-theme.css`   | Single `@theme` block - generates Tailwind utilities  | Add new Tailwind color utilities |
| `styleguide-scope.css` | Overrides CSS variables for styleguide components     | Add new color mappings           |
| `typography.css`       | Typography utilities (`.text-lead`, `.button-text-*`) | Add typography classes           |
| `../app/globals.css`   | Webapp `:root` defaults + webapp-specific styles      | Add webapp color variables       |

---

## How Color Scoping Works

### The Problem

The webapp uses one color system (dark indigo primary `#242D3D`) and the styleguide uses another (blue primary `#2563EB`). Both use the same Tailwind classes like `bg-primary`.

### The Solution: CSS Variable Scoping

We use a **CSS variable reference pattern** that allows the same Tailwind class to resolve to different colors based on DOM context.

#### Step 1: Webapp Defaults (`:root` in `globals.css`)

```css
:root {
  --primary: #242d3d; /* Webapp's dark indigo */
  --secondary: #ffc523; /* Webapp's yellow */
}
```

#### Step 2: Variable References (`@theme` in `tailwind-theme.css`)

Tailwind v4's `@theme` block generates utility classes that **reference** CSS variables instead of static values:

```css
/* tailwind-theme.css */
@theme {
  --color-primary: var(--primary); /* NOT a static hex value */
  --color-secondary: var(--secondary);
}
```

This generates:

```css
.bg-primary {
  background-color: var(--primary);
}
```

#### Step 3: Styleguide Overrides (`styleguide-scope.css`)

For elements with `[data-slot]`, we override the CSS variables:

```css
[data-slot],
[data-slot] * {
  --primary: var(--theme-primary); /* #2563EB (styleguide blue) */
  --color-primary: var(--theme-primary); /* Override Tailwind's reference too */
}
```

#### Result: Context-Aware Colors

```
┌─────────────────────────────────────────────────────────────────┐
│ Same class "bg-primary" → Different colors based on context    │
├─────────────────────────────────────────────────────────────────┤
│ <button class="bg-primary">           → #242D3D (dark indigo)  │
│ <Button data-slot="button">           → #2563EB (blue)         │
└─────────────────────────────────────────────────────────────────┘
```

### Why `data-slot`?

shadcn/ui components automatically include `data-slot` on their root elements. This means:

- No extra work needed - components are automatically styled correctly
- Legacy webapp code (without `data-slot`) keeps its original colors
- Incremental adoption - migrate one component at a time

---

## Tailwind v4 CSS Setup

We use **Tailwind CSS v4** with a pure CSS-first configuration — no `tailwind.config.js`. The import order in `globals.css` is critical:

```css
/* 1. Raw CSS variables that @theme will reference */
@import '../styleguide/design-tokens.css';

/* 2. Core Tailwind — MUST come before @theme, @plugin, @source */
@import 'tailwindcss';

/* 3. Plugin (replaces plugins[] in tailwind.config.js) */
@plugin "@tailwindcss/typography";

/* 4. Content sources (replaces content[] in tailwind.config.js) */
@source "../app";
@source "../components";
@source "../styleguide";

/* 5. @theme block — MUST come AFTER @import "tailwindcss" */
@import '../styleguide/tailwind-theme.css';

/* 6. Additional CSS */
@import '../styleguide/typography.css';
@import '../styleguide/styleguide-scope.css';
@import 'tw-animate-css';
```

**Why this order?**

1. `design-tokens.css` — Raw CSS variables must exist before `@theme` references them via `var()`
2. `@import 'tailwindcss'` — Core framework must load first so it can process `@theme`, `@plugin`, and `@source`
3. `@plugin` / `@source` — Replaces the old `tailwind.config.js` plugins and content arrays
4. `tailwind-theme.css` — The `@theme` block that generates Tailwind utility classes. **Must come after `@import 'tailwindcss'`**
5. Other CSS — Typography, scoping overrides, animations

> **Important:** There is no `tailwind.config.js` file. Tailwind v4 uses `@plugin`, `@source`, and `@theme` CSS directives instead. See the [Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide).

---

## Figma Token → Tailwind Class Mapping

Use Figma token names directly as Tailwind classes.

### Theme Colors (`theme/*`)

| Figma Token                | Value     | Tailwind Class               |
| -------------------------- | --------- | ---------------------------- |
| `theme/primary`            | `#2563EB` | `bg-primary`, `text-primary` |
| `theme/primary-foreground` | `#FFFFFF` | `text-primary-foreground`    |
| `theme/secondary`          | `#0B1529` | `bg-secondary`               |
| `theme/destructive`        | `#E00C30` | `bg-destructive`             |

### Brand Colors (`goodparty/*`)

| Figma Token       | Tailwind Class   |
| ----------------- | ---------------- |
| `goodparty/red`   | `bg-brand-red`   |
| `goodparty/blue`  | `bg-brand-blue`  |
| `goodparty/cream` | `bg-brand-cream` |

### Brand Scales (`midnight/*`, `halo green/*`, etc.)

| Figma Token         | Tailwind Class               |
| ------------------- | ---------------------------- |
| `midnight/500`      | `bg-brand-midnight-500`      |
| `midnight/900`      | `bg-brand-midnight-900`      |
| `halo green/400`    | `bg-brand-halo-green-400`    |
| `lavender/600`      | `bg-brand-lavender-600`      |
| `waxflower/400`     | `bg-brand-waxflower-400`     |
| `bright yellow/600` | `bg-brand-bright-yellow-600` |

### Semantic Scales (`error/*`, `success/*`, etc.)

| Figma Token   | Tailwind Class                   |
| ------------- | -------------------------------- |
| `error/500`   | `bg-error-500`, `text-error-500` |
| `success/500` | `bg-success-500`                 |
| `info/500`    | `bg-info-500`                    |
| `warning/500` | `bg-warning-500`                 |

### Base Tokens (`base/*`)

| Figma Token       | Tailwind Class         |
| ----------------- | ---------------------- |
| `base/foreground` | `text-base-foreground` |
| `base/background` | `bg-base-background`   |
| `base/muted`      | `bg-base-muted`        |
| `base/border`     | `border-base-border`   |

### Chart Colors (`data/chart-*`)

| Figma Token    | Tailwind Class    |
| -------------- | ----------------- |
| `data/chart-1` | `bg-data-chart-1` |
| `data/chart-2` | `bg-data-chart-2` |

### Grayscale (`grayscale/*`)

| Figma Token     | Tailwind Class       |
| --------------- | -------------------- |
| `grayscale/500` | `text-grayscale-500` |
| `grayscale/900` | `text-grayscale-900` |

---

## Color Reference (Webapp vs Styleguide)

| Utility          | Webapp (`:root`)        | Styleguide (`[data-slot]`) |
| ---------------- | ----------------------- | -------------------------- |
| `bg-primary`     | `#242D3D` (dark indigo) | `#2563EB` (blue)           |
| `bg-secondary`   | `#FFC523` (yellow)      | `#0B1529` (midnight)       |
| `bg-tertiary`    | `#6E37FF` (purple)      | `#63D1A0` (halo green)     |
| `bg-destructive` | `#E00C30`               | `#E00C30`                  |

---

## Syncing Design Tokens from Figma

When Figma tokens change:

1. **Get values from Figma** using Figma MCP tool or manual inspection
2. **Edit `design-tokens.css`** with new raw values
3. **Update `tailwind-theme.css`** if new Tailwind utilities needed
4. **Update `styleguide-scope.css`** if new variable mappings needed for scoping

### Figma Design System URLs

| Section         | Node ID       |
| --------------- | ------------- |
| Branding Colors | `23364-36102` |
| Semantic Colors | `24445-53631` |
| Tailwind Colors | `24445-54212` |
| Theme           | `24452-18276` |

Base URL: `https://www.figma.com/design/dmMrTWyBirANhArKs5mTmr/GoodParty-Design-System----shadcn-ui`

---

## Storybook

```bash
npm run storybook        # Start dev server
npm run build-storybook  # Build static site
```

Stories are wrapped in a `data-slot` container so styleguide colors apply correctly.

---

## Adding Components

1. Create component in `components/ui/newcomponent.tsx`
2. Add `data-slot="component-name"` to root element
3. Export from `components/ui/index.ts`
4. Create story in `stories/NewComponent.stories.tsx`

### Custom Components That Need Styleguide Colors

If creating a non-shadcn component that should use styleguide colors:

```tsx
// ✅ Will use styleguide colors
<div data-slot="card" className="bg-primary">...</div>

// ❌ Will use webapp colors
<div className="bg-primary">...</div>
```

---

## Incremental Adoption

Styleguide components can coexist with legacy components:

```tsx
export function MyPage() {
  return (
    <div>
      {/* Legacy - uses webapp colors */}
      <button className="bg-primary">Legacy</button>

      {/* Styleguide - uses styleguide colors */}
      <Button variant="default">Styleguide</Button>
    </div>
  )
}
```

**Migration tips:**

- Start with isolated components (buttons, inputs, badges)
- Test visually in Storybook
- Check responsive behavior - styleguide may use different breakpoints
- Preserve functionality first, then adopt styleguide interactions

---

## Known Issues & Gotchas

### Multiple `@theme` Blocks

Tailwind v4 doesn't handle multiple `@theme` blocks well - later blocks override earlier ones. **Never add `@theme` to other CSS files.** All theme config must go in `tailwind-theme.css`.

### Color Format Mismatch

Webapp uses HSL format for some shadcn variables, styleguide uses hex. We provide HSL fallbacks in the `@theme` block:

```css
--color-background: hsl(var(--background, 0 0% 100%));
```

### Typography Bleeding

`typography.css` only contains utility classes (no element selectors). Typography is scoped via `[data-slot]` in `styleguide-scope.css`. Don't add `:root` or element selectors to `typography.css`.

### Dark Mode

Dark mode scoping needs separate selectors. `styleguide-scope.css` includes:

```css
.dark [data-slot],
.dark [data-slot] *,
[data-slot].dark {
  ...;
}
```

Update both light and dark sections when adding dark mode support.

---

## Troubleshooting

### Wrong colors on styleguide component

1. Inspect element — verify `data-slot` attribute exists
2. Check DevTools computed styles for variable values
3. Verify `styleguide-scope.css` is imported after `tailwindcss` in `globals.css`

### Legacy component colors changed unexpectedly

1. Check no parent has `data-slot` attribute
2. Verify `:root` values in `globals.css`

### Tailwind class not generating

1. Verify the import order in `globals.css` — `@theme` must come AFTER `@import 'tailwindcss'`
2. Verify color is in `@theme` block in `tailwind-theme.css`
3. Check naming matches (e.g., `brand-midnight-500` not `midnight-500`)
4. After config changes, clear cache: `rm -rf .next && npm run dev`

### CSS variables not working

1. Check browser DevTools - inspect computed styles for resolved values
2. Check inheritance - variables might be blocked by a closer ancestor
3. Variable names are case-sensitive

---

## Migration from npm Package

```tsx
// ❌ OLD
import { Button } from 'goodparty-styleguide'

// ✅ NEW
import { Button } from '@/styleguide'
```

---

## Tech Stack

| Technology             | Purpose                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| Tailwind CSS v4        | CSS-first config (`@theme`, `@plugin`, `@source`) — no JS config file |
| `@tailwindcss/postcss` | PostCSS plugin for Tailwind v4 processing                             |
| shadcn/ui              | Component primitives with `data-slot`                                 |
| Radix UI               | Accessible headless primitives                                        |
| Storybook 10           | Component documentation                                               |

---

## Tailwind v4 Migration Fixes

During the Tailwind v4 upgrade, several behavioral changes required fixes in `globals.css`:

1. **Cursor pointer** — v4 preflight no longer includes `cursor: pointer` for buttons. Added `@layer base` rule.

2. **Button/link font-weight** — v4 preflight doesn't set `font-weight: 500`. Added `@layer base` rule.

3. **Heading letter-spacing** — v4 preflight doesn't set `-0.02em` on headings. Added `@layer base` rule.

4. **Default line-height** — v4 uses `1.5` (inherited) vs v3's `1.3`. Set `1.3` on `div, span` in `@layer base`.

5. **Flex button alignment** — Cascade changes caused `inline-block` to override `flex` on buttons. Added scoped rule for `a.flex.items-center:not([data-slot])`.

6. **CSS variable references** — `@theme` uses `var()` references (e.g., `--color-primary: var(--primary)`) instead of static values, enabling runtime scoping.

7. **Important modifier syntax** — v4 uses suffix `hidden!` instead of prefix `!hidden`. The old syntax still works but is deprecated.

These fixes are in `app/globals.css` and apply automatically. See `styleguide/CHANGELOG.md` for details.

---

_Last updated: January 2026_
