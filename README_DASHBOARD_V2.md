# Dashboard V2 (Guarded) - SAFE, Non-destructive

This README explains how to run the dashboard audit and enable the guarded V2 layout.

## Feature Flag

- `.env`: `DASHBOARD_V2=false`
- `lib/flags.ts` exposes `export const DASHBOARD_V2 = process.env.DASHBOARD_V2 === 'true'`

Toggle to true to render the V2 layout without removing existing blocks.

## Audit Scripts

- `pnpm audit:dashboard:routes` → writes A_screens-inventory.md (JSON content)
- `pnpm audit:dashboard:links` → writes B_links-inventory.json and B_links-inventory.md
- `pnpm audit:dashboard:components` → writes C_components-map.md
- `pnpm audit:dashboard:all` → runs all

Artifacts are under `/docs/dashboard_audit/` (A–F).

## Acceptance Criteria

- All links in B_links-inventory.json resolve for both `/br/*` and `/fr/*`.
- No navigation removed; side-nav preserved.
- Lighthouse a11y ≥ 90; no regression.
- No bundle increase > +150 KB; keep charts dynamic.
- Playwright smoke: dashboard renders in BR/FR; all CTAs navigate.

## Integration

- In `app/[locale]/dashboard/page.tsx`, read `DASHBOARD_V2` and render new hero and top row only when true.
- Keep original sections unchanged.
