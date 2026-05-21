# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Scope

Only do exactly what is asked. Do not fix adjacent issues, tackle the "next item," or make unrequested improvements. If you notice something else worth fixing, mention it — but do not act on it unless explicitly asked.

## Commands

```bash
npm run dev              # Dev server on :4000 with local API (localhost:3000)
npm run dev-dev          # Dev server on :4000 with remote dev API
npm run build            # Production build
npm run lint             # ESLint + Prettier check
npm run lint:fix         # Auto-fix lint issues
npm run test             # Vitest (single run)
npm run test:watch       # Vitest in watch mode
npm run test:e2e         # Playwright E2E tests
npm run types            # TypeScript type check
npm run storybook        # Component library on :6006
```

## Architecture

Next.js 15 App Router deployed on Vercel. Calls gp-api (NestJS backend on ECS) and election-api for data. Full overview: `docs/architecture.md`.

### Deployment

Vercel auto-deploys on push. Branch mapping:

- `develop` → `dev.goodparty.org` (API: `gp-api-dev.goodparty.org`)
- `qa` → `qa.goodparty.org` (API: `gp-api-qa.goodparty.org`)
- `master` → `goodparty.org` (API: `api.goodparty.org`)
- PR branches → Vercel preview environments

### Environment Config

`appEnv.ts` exports all env-derived constants: `API_ROOT`, `ELECTION_API_ROOT`, `APP_BASE`, `IS_PROD`, `IS_LOCAL`, etc. Defaults point to dev API when env vars are unset.

(Auth, providers, API clients, and module shape live in `docs/architecture.md` and the per-area `CLAUDE.md` files — see the pointer table below.)

## Testing

Vitest + React Testing Library + jsdom. Test globals enabled (no imports needed for `describe`, `it`, `expect`, `vi`).

After refactoring a component, run `npm run test` locally and update any tests that reference old selectors (e.g. library-specific CSS classes like `.Mui-error`), old copy, or old component APIs before pushing. Do not rely on CI to catch these — fix them first.

### Targeted runs

```bash
npx vitest run path/to/file.test.tsx     # single file
npx vitest run -t "creates a poll"       # by name pattern
npx vitest --watch path/to/file.test.tsx # single file in watch mode
```

Full guide: `docs/testing.md`.

### API Mocking

MSW-based via `helpers/test-utils/api-mocking.ts`. Routes must match keys in `APIEndpoints`:

```typescript
import { api } from 'helpers/test-utils/api-mocking'

api.mock('GET /v1/polls', {
  status: 200,
  data: { results: [], pagination: { nextCursor: undefined } },
})
```

Other patterns (`mockOrdered`, dynamic handlers): `docs/testing.md`.

### Test Utilities

- `helpers/test-utils/render.tsx` - Custom render wrapping `QueryClientProvider`
- `helpers/test-utils/router-mocking.ts` - Mocked `useRouter()` (auto-applied in `vitest.setup.ts`)
- `vitest.setup.ts` - Loads jest-dom matchers, clears React Query cache between tests, mocks `next/navigation`

### AI Code Review

`ai-rules/` is a git submodule with focused rule files. Run `npm run ai-rules:update` to pull the latest. The wired-up critic agent lives at `.claude/agents/code-critic.md` — invoke it via `@code-critic` (or just spawn a subagent that loads the rule files and reviews the diff).

## Boundaries

- **Never** edit `middleware.ts`, `app/api/revalidate/route.ts`, or `gpApi/api-endpoints.ts` without explicit confirmation. The first two affect every request; the third is a cross-repo contract with `gp-api`.
- **Never** commit env files. `.env.example` only.
- **Never** push to `develop` directly — open a PR.
- **Ask first** before adding new utilities to `helpers/` (it is already a 50+ file dumping ground; check whether the helper exists). See `gpApi/CLAUDE.md` for fetch-helper rules.
- **Deploys** are automatic via Vercel on push to `develop` / `qa` / `master`. There is no manual deploy command.

## Navigation

When the active step or view changes in a multi-step flow, always reset scroll position to the top (`window.scrollTo(0, 0)`) via a `useEffect` that watches the active step identifier.

## Observability

- **Frontend errors → Sentry.** Org slug `goodparty`. https://goodparty.sentry.io.
- **Backend logs → Grafana Cloud Loki.** `{service_name="gp-api", deployment_environment_name="dev|qa|prod"}`. https://goodparty.grafana.net.
- Recipe for reproducing a Sentry issue locally: `docs/debugging.md`.

## Pointer table — when in doubt

| Doing | Read |
|-------|------|
| Overall architecture / stack / module shape | `docs/architecture.md` |
| Auth (cookie/JWT, server vs client, impersonation) | `docs/architecture.md` § Auth |
| Adding or migrating an API call | `docs/api-clients.md` + `gpApi/CLAUDE.md` |
| Writing a unit/component test | `docs/testing.md` |
| Reproducing a Sentry issue locally | `docs/debugging.md` |
| State / providers / React Query patterns | `docs/state-management.md` |
| Adding or removing a feature flag | `docs/feature-flags.md` |
| Working inside a dashboard feature | `app/dashboard/<feature>/CLAUDE.md` |
| Working in `app/admin/`, `app/onboarding/`, or `app/shared/` | nested `CLAUDE.md` in that dir |
| Working with helpers | `helpers/CLAUDE.md` |
| Working in `gpApi/` | `gpApi/CLAUDE.md` |
| Writing or running E2E tests | `e2e-tests/CLAUDE.md` (and `e2e-tests/README.md`) |
| AI rule-by-rule code review | `ai-rules/` (git submodule) |
| Website feature internals | `app/dashboard/website/README.md` |

## Code Style

- No semicolons, single quotes, trailing commas (Prettier)
- `@shared/*` path alias maps to `app/shared/*`
- Strict TypeScript: `noImplicitAny`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`
- ESLint enforces no unused imports via `unused-imports/no-unused-imports`

## Styleguide

### Components

Always use styleguide components (`Button`, `Input`, `Label`, etc.) imported from `@styleguide` instead of raw HTML elements (`<button>`, `<input>`, `<label>`). Raw elements are only acceptable inside styleguide component definitions themselves (`styleguide/components/ui/`).

Before implementing a pattern manually (wrapper divs, absolute positioning, ad-hoc layout), check whether the primitive component should support it as a prop instead. Build capability at the component level so it is reusable.

### Toggle and Selection

Use Radix `ToggleGroup` (`@radix-ui/react-toggle-group`) for filter pills and any toggleable selection UI. Never use `Button` with `aria-pressed` for this pattern — `ToggleGroup` provides correct semantics, roving focus, and controlled state out of the box.

Always pass a defined `value` to controlled Radix components — never use `value={someState || undefined}` to express "nothing selected." That pattern toggles the component between controlled and uncontrolled modes on every deselect, causing internal state desync. Use `value={someState}` and let `""` mean nothing selected.

### Icons

Always use `lucide-react` for icons. Never use `react-icons` or other icon libraries. Check `lucide-react` for an equivalent before considering any alternative.

**Approved-icons gate.** New icon usage must go through `styleguide/components/ui/icons.tsx`, not directly from `lucide-react`. That file is the curated set of icons the team has approved for use in the design system; importing from it (rather than `lucide-react`) keeps the catalog auditable and consistent. If the icon you need isn't there, add it to `icons.tsx` first (using the existing `Foo as FooIcon` alias pattern), then import from `./icons`. The full lucide catalog is browseable in Storybook (`Foundations/Icons`). Existing direct `lucide-react` imports in `app/` are grandfathered; do not add new ones.

### Design Tokens

- Never use raw hex colors, hardcoded pixel values, or Tailwind default color palette (e.g. `blue-600`, `slate-300`) in component code. Always reference a design token.
- Check `styleguide/design-tokens.css` for available tokens and `styleguide/tailwind-theme.css` for their Tailwind utility class names.
- Colors in `tailwind-theme.css` are registered as `--color-*` and have a corresponding Tailwind utility (e.g. `--color-components-input-active` → `border-components-input-active`). **Never** use CSS variable bracket syntax (e.g. `bg-[--some-variable]`, `border-[--some-variable]`) — it does not reliably render in Tailwind v4. Always use the registered utility class name.
- Never modify shared CSS variables (`--input`, `--border`, etc.) to fix a single component's appearance — these affect borders, backgrounds, and focus rings globally. Fix at the component level using the correct token.

### Figma

When implementing or matching a Figma design, read the generated code structure — not just the screenshot. The code shows exact token names, sizing, and state logic. The screenshot can mislead.

### Component authoring

When authoring a new styleguide component that wraps a Radix primitive (or similar), the consumer's `className` must land on the element the public TS prop signature references. If the signature is `React.ComponentProps<typeof X>`, `className` must merge onto `X` — not onto a wrapper div, an inner padding div, or a portal. Inner styling that doesn't belong to the consumer (padding, layout-only spacing) goes in fixed class strings on the inner elements; consumers should never need to "reach past" a wrapper to override styles on the typed-by-signature element. Sibling components in the same file must be consistent: if `AccordionItem` and `AccordionTrigger` merge `className` onto their primitive, `AccordionContent` must too.

`data-slot` attributes only forward through real DOM elements. Radix `Portal` wraps `React.createPortal` and accepts only `container`, `forceMount`, and `children` — any other prop (including `data-slot`) is silently dropped. Put `data-slot` on the Content/Trigger/Item primitives, not on Portal.

### Storybook stories

Use CSF 3 (object stories) throughout. Every story file should set `meta.component` to the typed component and `tags: ['autodocs']` so Storybook generates a Docs page and can infer controls from prop types.

Each component story file has two kinds of stories:

1. **One `Playground` story** — args-driven, listed first. Declares `args` for the root component's primitive props plus `argTypes` overrides where the inferred control needs help (selects, number ranges, custom labels). The render function consumes `args` so the Controls panel actually does something. This is the interactive sandbox for designers and engineers.
2. **Named variant stories** — static showcase renders (`Default`, `Multiple`, `DefaultOpen`, `Disabled`, etc.). No `args`, no Controls noise. These document specific states or compositions and are not meant to be tweaked.

For compound components (Radix-style root + parts), the `render` escape hatch is correct — children structure cannot be expressed as a flat arg. The Playground still uses `args` for the root's primitive props and hardcodes a representative children tree.

Init-only props (`default*` like `defaultOpen` / `defaultValue`) don't belong in Controls — Storybook re-renders the story without remounting, and Radix ignores changes to `default*` props after first render, so toggling the control does nothing. Demonstrate those via a named variant instead.

Use `play` functions only for interaction examples worth testing (click trigger, verify content appears). Optional, not required.
