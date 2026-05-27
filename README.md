# Salary Management — Web Portal

Frontend for a salary management tool aimed at an HR Manager of an org with 10,000 employees. Take-home assignment for Incubyte.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- shadcn/ui for components
- TanStack Query for server state
- react-hook-form + Zod for form validation
- axios for HTTP
- Vitest + React Testing Library + MSW for unit and component tests
- Playwright for end-to-end tests
- Hosted on AWS Amplify

## What it does

- Login (JWT cookie-based auth, redirect on success) with polished card UI and dark-mode-aware backdrop
- Auth-gated routes via Next.js middleware
- Home dashboard with welcome, quick-stat cards, recent additions and shortcuts
- Employees list with pagination, search, and country/department/job-title filters (all URL-driven)
- Add, edit, and delete employees (delete is optimistic). **The Edit dialog is the employee detail view** — clicking Edit on a row shows every field; no separate `/employees/[id]` page by design.
- Insights dashboard: summary tiles (total employees, countries, top country, top role), salaries by country (min/max/avg/median) **in each country's own currency**, salary distribution chart per country, headcount by department, employment-type breakdown, and average salary by role with country selector.
- Persistent navbar (brand, nav links, user menu, **light/dark theme toggle**) and footer across authenticated pages.

## Run locally

```bash
npm install
cp .env.example .env   # edit values if needed (defaults work out of the box)
npm run dev
```

A single `.env` file holds config for both environments. `NODE_ENV` (set automatically by Next: `development` for `next dev`, `production` for `next build`) decides which URL is used:

- `NEXT_PUBLIC_API_URL_DEV` — used in dev (default `http://localhost:4000`)
- `NEXT_PUBLIC_API_URL_PROD` — used in production builds (Render URL)

The backend repo is at `salary-management-api-server`.

### Run without a backend (dev mock mode)

`NEXT_PUBLIC_API_MOCKING=true` in `.env` makes the frontend load an MSW service worker in the browser and intercept all API calls with realistic mock data (50 seeded employees across 5 countries). Login accepts any credentials. Auth middleware is bypassed while mocking is on. Useful for inspecting the UI before the real backend is up. **Production builds ignore this flag** — the worker is never started outside dev.

## Tests

```bash
npm run test:run    # vitest + RTL + MSW (component-level)
npm run test:e2e    # playwright happy-path (needs backend or deployed URL)
npm run lint
npm run format
```

`vitest.setup.ts` boots an MSW server that intercepts network calls in tests. **MSW is not loaded in dev or production**; the real backend is always used outside tests.

## TDD approach

Every feature was built outside-in via small red→green→refactor commits. The git log reads as the TDD story:

- `test: <thing> (fail: <reason>)` — RED commit, the failing test goes in.
- `test: <thing>` — GREEN commit, code that makes the prior test pass.
- A plain commit like `extract use-X hook` — REFACTOR, tests stay green.

Run `git log --oneline` to see the cycle for each feature.

## Branching

- `main` — release branch.
- `dev` — integration branch where features land.
- `feature/<slug>` — one branch per feature; merged into `dev` with `--no-ff` once tests are green.

## Deployment (AWS Amplify)

1. Connect this repo to AWS Amplify Hosting and pick the branch to deploy (`main` for prod).
2. Amplify picks up `amplify.yml` automatically — no further build config needed.
3. Set `NEXT_PUBLIC_API_URL_PROD` in Amplify env vars to the deployed backend's URL (e.g., `https://api.example.com`) and `NEXT_PUBLIC_API_MOCKING=false`.
4. Amplify auto-deploys on every push to the connected branch.

## Project layout

```
src/
├── app/
│   ├── login/page.tsx          → /login
│   ├── employees/page.tsx      → /employees (CRUD + filters + pagination)
│   ├── insights/page.tsx       → /insights
│   ├── providers.tsx           → TanStack Query client
│   ├── layout.tsx              → root shell
│   └── page.tsx                → / (placeholder)
├── components/
│   ├── ui/                     → shadcn primitives
│   ├── employees/              → table, form, filters, pagination
│   ├── insights/               → summary tiles, by-country cards, by-job-title table
│   ├── header.tsx              → top bar
│   └── app-shell.tsx           → centred page shell
├── hooks/                      → useEmployees, useLogin, useCreateEmployee, useInsights*, etc.
├── lib/
│   ├── api-client.ts           → axios instance (baseURL + credentials)
│   └── api-contract.ts         → Zod schemas + inferred TypeScript types
├── mocks/                      → MSW handlers + server (test-only)
└── middleware.ts               → auth-cookie redirect
```

## Out of scope (intentional)

- Server-side data fetching / RSC for data (would bypass MSW in tests)
- Dark-mode toggle, i18n
- CSV import/export
- Role-based access (single HR user)
- Multi-currency aggregation with FX (aggregates are country-scoped, one currency per country)
