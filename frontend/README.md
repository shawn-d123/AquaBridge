# AquaBridge frontend — Farhan’s Sprint 1 work

React 19 + Vite 8 + Tailwind CSS 4 + React Router 8, tested with Vitest. Built to match the team prototype in
[`../app`](../app) and the design system on the live site.

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm test         # 70 tests: rules, species, routes, sign-in, full journeys, accessibility (axe-core)
npm run lint
npm run build
```

## What’s in here (Farhan’s Jira tickets)

| Ticket | What | Where |
|---|---|---|
| **SH-04** (KAN-10) | Homepage, header with account menu and mobile menu, footer, route map, content pages, not-found page, skip link, page titles | `src/features/home`, `src/shared/Layout.jsx`, `src/routes.js`, `src/App.jsx` |
| **SH-05** (KAN-11) | Sign in / Create an account, mock auth module, route guards, return-to-action (kept in sessionStorage, never in the URL) | `src/features/auth`, `src/shared/RequireAuth.jsx` |
| **F-01** | Questionnaire shell: Step N of 4, progress bar, Back/Continue, error summary, draft saved across reloads | `src/features/guidance/RehomePage.jsx` |
| **F-02** | Animal/plant questions, species filtered by type, quantity 1–500, health text only when not healthy, location, urgency | `RehomePage.jsx`, `intake.js` |
| **F-03** | Check your answers with Change links that come straight back | `ReviewPage.jsx` |
| **F-04** | Example guidance rules: eligible / needs review / restricted, reasons from the answers, urgent variant | `GuidancePage.jsx`, `intake.js` |
| **F-05** | Species catalogue (`getSpecies`, `listSpecies`), shared `CareList`, care needs panel | `src/services/species.js`, `CareList.jsx`, `CareWidget.jsx` |
| **F-06** | Handoff to the listing editor (`getHandoff(intake)`); needs-review and restricted can’t reach the editor | `intake.js` |
| **F-07** | Tests for navigation, validation and every outcome | `*.test.js(x)` |
| **F-08** | Species guide list with search and filter, species pages, restricted and not-found states | `SpeciesPages.jsx` |

## Try it

| To see… | Do this |
|---|---|
| Eligible | Rehome → An animal → Neon tetra, 6 → Healthy → any town → Create my listing → sign in with any email |
| Needs review | Rehome → An animal → I’m not sure what it is (or choose “Unwell”) |
| Restricted | Rehome → An animal → Red-eared slider |
| Return after sign-in | While signed out open `/check/L-1044`, sign in, you land back on it |

## Teammates’ parts

Screens owned by Shawn and Midhir are **placeholders** (`features/listings/ListingPlaceholders.jsx`,
`features/habitat/HabitatPlaceholders.jsx`) so every route loads. The shared components in `src/shared/components`
and the listing/request fixtures in `src/services/seed.js` are stand-ins until SH-02 (Midhir) and SH-03 / S-08 (Shawn)
are merged. Swap them in without changing the props.

**For Shawn’s editor:** read the pre-fill with `getHandoff(state.intake)` from `features/guidance/intake.js`; it returns
`null` unless the intake is complete and eligible. Clear the draft with `s.intake = freshIntake()` after publishing.
**For everyone:** read species only through `getSpecies` / `listSpecies`, and the signed-in user through `useAuth()`.
