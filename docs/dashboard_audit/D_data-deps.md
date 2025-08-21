# D. Data Dependencies (Dashboard)

Scope: app/[locale]/dashboard/page.tsx and imported components used directly from the page

## Supabase Tables/Queries Observed

- holerites
  - Read latest by `user_id`, ordered by `created_at` desc, limit 1, `.single()`
  - Required columns referenced in code: `structured_data`, `gross_salary | salario_bruto`, `net_salary | salario_liquido`, `fgts`, `analysis_result`, `recommendations`
  - RLS expectation: row owner can SELECT where `user_id = auth.uid()`

- beneficios_usuario
  - Query: `select tipo, ativo where user_id = user.id`
  - Used to derive detected benefits when no OCR/IA data is present
  - RLS expectation: row owner can SELECT where `user_id = auth.uid()`

- auth (Supabase auth API)
  - `supabase.auth.getUser()` to get current user id
  - Session is provided via context (`useSupabase`)

## Hooks/Data Accessors

- useUserOnboarding(userId)
  - Determines onboarding completion flags (profile_completed, checkup_completed, holerite_uploaded)
  - RLS: Should only read onboarding state for the current user

- useFinancialCheckup(userId)
  - Provides `latestCheckup` and `loading`
  - Likely backed by a `financial_checkups` (or similar) table
  - RLS expectation: SELECT current user's rows only

- useInvestimentos(userId, holeriteRaw)
  - Returns `investimentos` list; details not in this file
  - RLS expectation: per-user data

## External APIs

- None called directly from the dashboard (OCR/IA flow is invoked via `/br/scan-new-pim` route)

## Derived Data and Local State

- `holeriteResult` is stored in component state and optionally mirrored to `localStorage`
- Benefits (beneficiosDetectados) are derived from OCR/IA payload or fallback DB query

## RLS Checklist

- [x] Reads filtered by `user_id`
- [x] Session enforced (`useSupabase`, redirect to login if `session === null`)
- [x] No cross-user reads observed in dashboard page
- [ ] Verify underlying hooks `useFinancialCheckup` and `useInvestimentos` enforce `user_id = auth.uid()`

## Minimal Contract (Types)

- Holerite minimal shape used:
  - `structured_data.final_data` (various numeric paths)
  - `raw.recommendations` tree (for AI recommendations)
  - `fgts` number (optional)

## Notes

- Keep all queries identical in v2 components. No business logic changes.

