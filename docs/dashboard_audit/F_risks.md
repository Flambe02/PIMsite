# F. Risk Register (Dashboard refactor behind DASHBOARD_V2)

- Sidebar tab buttons rely on `data-tab` and internal `activeTab` state.
  - Risk: Changing DOM order or IDs may break tests or user muscle memory.
  - Mitigation: Keep same labels and order; preserve `data-tab` attributes.

- `router.push` targets:
  - `/br/scan-new-pim`, `/simuladores/beneficios`, `/dashboard` back links
  - Risk: Moving buttons could hide discoverability.
  - Mitigation: Preserve CTAs in v2 hero/top-row; reuse same handlers.

- FinancialCheckupSummaryCard placement (right column):
  - Risk: Lighthouse layout shift if moved without placeholders.
  - Mitigation: Keep in right column for v2; hero only elevates 360° summary block.

- Dynamic imports dependencies:
  - Risk: Bundle increase if charts are inlined.
  - Mitigation: Keep charts dynamic; lazy load in v2 as in v1.

- i18n custom scheme:
  - Risk: New strings missing in FR.
  - Mitigation: Reuse existing keys; if new text needed, duplicate BR/FR keys.

- Acceptance tests (Playwright smoke planned):
  - Risk: Query selectors rely on text labels.
  - Mitigation: Preserve text labels, add `data-testid` only as additive.
