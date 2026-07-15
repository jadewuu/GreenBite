# GreenBite Member Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver every updated GreenBite Figma page and its interactive state as a responsive mobile-web application with local mock APIs.

**Architecture:** HashRouter owns navigable screen addresses and preserves GitHub Pages compatibility. Typed async mock API modules are the only source of member, rewards, coupon, and profile data; route components consume those modules through small hooks and never import fixture data directly. A responsive app shell fills mobile widths, expands to 768px on tablets, then remains centered.

**Tech Stack:** React, TypeScript, Vite, HashRouter, Tailwind CSS, shadcn/ui, Sonner, Vitest, Testing Library.

## Global Constraints

- Implement every screen and interaction state in Figma section `5:3117`.
- Use HashRouter, local mock APIs, Figma assets, Satoshi, existing shadcn/ui primitives, and the existing Vite GitHub Pages base.
- Mobile web is primary at 360px through 402px; tablet content expands fluidly to 768px; desktop stays centered and single-column.
- Preserve ten-digit US phone validation and fixed `123456` OTP behavior.
- Do not introduce a backend, another UI library, real SMS, real Wallet passes, payment processing, or a multi-column desktop dashboard.

---

## File structure

- `src/lib/api/types.ts`: API-domain types shared by routes and mock repositories.
- `src/lib/api/*.ts`: typed asynchronous local mock repositories.
- `src/lib/api/*.test.ts`: repository behavior tests.
- `src/router.tsx`: HashRouter route map and app-level providers.
- `src/components/app-shell.tsx`: 360–768px responsive canvas and common header.
- `src/features/auth/*`: existing entry, login, OTP, and success route components.
- `src/features/rewards/*`: rewards home, member code, tabs, empty state, points and coupon pages.
- `src/features/profile/*`: account, language, and two-step information routes.
- `src/index.css`: Figma tokens and responsive layout rules.
- `src/**/*.test.tsx`: interaction and route integration tests.

### Task 1: Add routing and typed local API boundaries

**Files:**
- Modify: `package.json`
- Create: `src/lib/api/types.ts`, `src/lib/api/member-api.ts`, `src/lib/api/rewards-api.ts`, `src/lib/api/coupons-api.ts`
- Test: `src/lib/api/member-api.test.ts`, `src/lib/api/rewards-api.test.ts`, `src/lib/api/coupons-api.test.ts`
- Create: `src/router.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Produces `MemberApi`, `RewardsApi`, `CouponsApi`, plus route paths `/`, `/login`, `/verify`, `/success`, `/rewards`, `/member-code`, `/points`, `/coupons`, `/account`, `/language`, and `/information/:step`.
- Later tasks consume repositories through asynchronous method calls only.

- [ ] **Step 1: Install the router and write failing repository tests**

Run:

```bash
npm install react-router-dom
```

Create `src/lib/api/member-api.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { memberApi } from "./member-api"

describe("memberApi", () => {
  it("updates the local member profile", async () => {
    const updated = await memberApi.updateProfile({ firstName: "John", lastName: "H.", birthday: "1990-01-01", email: "john@example.com" })
    expect(updated.firstName).toBe("John")
    expect(updated.email).toBe("john@example.com")
  })
})
```

Create equivalent tests that assert `rewardsApi.getOverview()` returns 1,230 points and `couponsApi.list()` returns five coupons.

- [ ] **Step 2: Verify the repository tests fail**

Run: `npm run test -- --run src/lib/api/member-api.test.ts src/lib/api/rewards-api.test.ts src/lib/api/coupons-api.test.ts`

Expected: FAIL because the API modules do not exist.

- [ ] **Step 3: Define the repository contracts and local implementations**

Create `src/lib/api/types.ts` with:

```ts
export type Member = { firstName: string; lastName: string; memberId: string; points: number; joinedAt: string; language: "en" | "es" | "zh"; birthday: string; email: string }
export type Coupon = { id: string; title: string; description: string; expiresAt: string; state: "available" | "used" | "expired" }
export type PointActivity = { id: string; date: string; merchant: string; points: number; kind: "earned" | "redeemed" }
export type ProfileInput = Pick<Member, "firstName" | "lastName" | "birthday" | "email">
```

Implement deterministic asynchronous methods `getCurrent()`, `updateProfile(input)`, `setLanguage(language)`, `getOverview()`, `getActivities()`, `setRewardsState("available" | "empty")`, `list()`, and `getById(id)`. Each method returns a Promise and the fixture state remains private to its module.

- [ ] **Step 4: Add the router shell**

Create `src/router.tsx` using `HashRouter`, `Routes`, and `Route`. Until each later route component exists, render a temporary accessible route title from a single local `RoutePlaceholder` component. Mount `AppRouter` from `src/main.tsx`.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm run test -- --run src/lib/api
npm run build
git add package.json package-lock.json src/lib/api src/router.tsx src/main.tsx
git commit -m "feat: add GreenBite routes and mock APIs"
```

Expected: repository tests pass and the build completes.

### Task 2: Route the existing authentication path into Rewards

**Files:**
- Modify: `src/components/rewards-flow.tsx`, `src/App.tsx`
- Create: `src/features/auth/auth-routes.tsx`
- Test: `src/features/auth/auth-routes.test.tsx`

**Interfaces:**
- Consumes HashRouter route paths and existing phone helpers.
- Produces a routed Landing -> Login -> Verification -> Success -> Rewards handoff.

- [ ] **Step 1: Write the failing primary-path test**

```tsx
it("routes a verified member to rewards", async () => {
  const user = userEvent.setup()
  render(<AppRouter />)
  await user.click(screen.getByRole("button", { name: "Join Rewards" }))
  await user.type(screen.getByLabelText("Phone number"), "4088881234")
  await user.click(screen.getByRole("button", { name: "Continue" }))
  for (const digit of "123456") await user.type(screen.getAllByLabelText("Verification digit")[0], digit)
  await user.click(await screen.findByRole("button", { name: "View Rewards" }))
  expect(await screen.findByRole("heading", { name: "Rewards & Coupon" })).toBeVisible()
})
```

- [ ] **Step 2: Verify the test fails**

Run: `npm run test -- --run src/features/auth/auth-routes.test.tsx`

Expected: FAIL because the Rewards route is not rendered after Success.

- [ ] **Step 3: Implement route-driven authentication**

Move existing screen state into route-level components. Navigation uses `useNavigate()`; Back uses `navigate(-1)`; Login retains phone state through `location.state`. Preserve `123456` validation, resend countdown and toast. Change Success `View Rewards` to `navigate("/rewards")`.

- [ ] **Step 4: Verify and commit**

Run:

```bash
npm run test -- --run src/features/auth/auth-routes.test.tsx src/components/rewards-flow.test.tsx
npm run build
git add src/App.tsx src/components/rewards-flow.tsx src/features/auth src/components/rewards-flow.test.tsx
git commit -m "feat: route verified members to rewards"
```

### Task 3: Build Rewards, member code, tabs, and empty states

**Files:**
- Create: `src/features/rewards/rewards-page.tsx`, `src/features/rewards/member-code-page.tsx`, `src/features/rewards/reward-tabs.tsx`, `src/features/rewards/coupon-card.tsx`
- Modify: `src/router.tsx`, `src/index.css`
- Test: `src/features/rewards/rewards-page.test.tsx`

**Interfaces:**
- Consumes `memberApi.getCurrent()`, `rewardsApi.getOverview()`, `rewardsApi.setRewardsState()`, `couponsApi.list()`.
- Produces the Figma Rewards, Rewards-scrolled, Rewards-tab, Rewards-empty, and Member Code behavior.

- [ ] **Step 1: Write the failing state-transition test**

```tsx
it("switches tabs, opens the member code, and renders the empty state", async () => {
  const user = userEvent.setup()
  render(<RewardsPage />)
  await user.click(await screen.findByRole("button", { name: "Show Member Code" }))
  expect(screen.getByRole("heading", { name: "Member Code" })).toBeVisible()
  await user.click(screen.getByRole("button", { name: "Close member code" }))
  await user.click(screen.getByRole("tab", { name: "Coupons" }))
  expect(screen.getAllByRole("article")).toHaveLength(5)
  await user.click(screen.getByRole("button", { name: "Show empty rewards" }))
  expect(screen.getByText("No Rewards & Coupon")).toBeVisible()
})
```

- [ ] **Step 2: Verify the test fails**

Run: `npm run test -- --run src/features/rewards/rewards-page.test.tsx`

Expected: FAIL because RewardsPage does not exist.

- [ ] **Step 3: Implement the Figma states**

Render the member summary, member ID, 1,230 points link, tabs, five coupon cards, scrollable list, and empty state. The header profile icon routes to `/account`; member-code entry routes to `/member-code`; points routes to `/points`; coupon interactions route to `/coupons`. Member Code has a close button and local Sonner Wallet feedback.

- [ ] **Step 4: Verify and commit**

Run:

```bash
npm run test -- --run src/features/rewards/rewards-page.test.tsx
npm run build
git add src/features/rewards src/router.tsx src/index.css
git commit -m "feat: add rewards member and coupon states"
```

### Task 4: Build points and coupon detail routes

**Files:**
- Create: `src/features/rewards/points-page.tsx`, `src/features/rewards/coupons-page.tsx`
- Test: `src/features/rewards/points-page.test.tsx`, `src/features/rewards/coupons-page.test.tsx`
- Modify: `src/router.tsx`

**Interfaces:**
- Consumes `rewardsApi.getActivities()` and `couponsApi.list()`.
- Produces Figma Points and Coupon pages with Back navigation.

- [ ] **Step 1: Write failing route tests**

```tsx
it("groups points activity by month", async () => {
  render(<PointsPage />)
  expect(await screen.findByText("July 2026")).toBeVisible()
  expect(screen.getByText("June 2026")).toBeVisible()
})

it("renders five coupon cards and returns with Back", async () => {
  const user = userEvent.setup()
  render(<CouponsPage />)
  expect(await screen.findAllByRole("article")).toHaveLength(5)
  await user.click(screen.getByRole("button", { name: "Back" }))
  expect(window.location.hash).toBe("#/rewards")
})
```

- [ ] **Step 2: Verify tests fail**

Run: `npm run test -- --run src/features/rewards/points-page.test.tsx src/features/rewards/coupons-page.test.tsx`

Expected: FAIL because detail pages do not exist.

- [ ] **Step 3: Implement Figma detail pages**

Render date-grouped point activity rows, coupon cards, mobile headers, and Back behavior. Use API data and map to the Figma 402px hierarchy; no direct fixture imports.

- [ ] **Step 4: Verify and commit**

Run:

```bash
npm run test -- --run src/features/rewards/points-page.test.tsx src/features/rewards/coupons-page.test.tsx
npm run build
git add src/features/rewards src/router.tsx
git commit -m "feat: add points and coupon detail pages"
```

### Task 5: Build account, language, and two-step information flow

**Files:**
- Create: `src/features/profile/account-page.tsx`, `src/features/profile/language-page.tsx`, `src/features/profile/information-page.tsx`
- Test: `src/features/profile/profile-routes.test.tsx`
- Modify: `src/router.tsx`, `src/index.css`

**Interfaces:**
- Consumes `memberApi.getCurrent()`, `memberApi.setLanguage(language)`, and `memberApi.updateProfile(input)`.
- Produces Account, Language, and Complete Information states from Figma.

- [ ] **Step 1: Write failing profile-flow tests**

```tsx
it("persists selected language and profile completion locally", async () => {
  const user = userEvent.setup()
  render(<AppRouter initialEntry="/#/account" />)
  await user.click(await screen.findByRole("button", { name: "Language" }))
  await user.click(screen.getByRole("radio", { name: "Spanish" }))
  expect(await screen.findByText("Spanish")).toBeVisible()
  await user.click(screen.getByRole("button", { name: "Complete information" }))
  await user.type(screen.getByLabelText("Email"), "john@example.com")
  await user.click(screen.getByRole("button", { name: "Continue" }))
  await user.click(screen.getByRole("button", { name: "Save information" }))
  expect(await screen.findByText("john@example.com")).toBeVisible()
})
```

- [ ] **Step 2: Verify the test fails**

Run: `npm run test -- --run src/features/profile/profile-routes.test.tsx`

Expected: FAIL because profile routes do not exist.

- [ ] **Step 3: Implement profile routes and validation**

Render Account member summary and list rows. Language renders English, Spanish, and Chinese radio items. Information step 1 validates required name, birthday, and email fields; step 2 renders the Figma confirmation state and saves through `memberApi.updateProfile`. Provide readable field errors and Back navigation.

- [ ] **Step 4: Verify and commit**

Run:

```bash
npm run test -- --run src/features/profile/profile-routes.test.tsx
npm run build
git add src/features/profile src/router.tsx src/index.css
git commit -m "feat: add account language and profile flow"
```

### Task 6: Apply responsive Figma alignment and verify all screens

**Files:**
- Modify: `src/components/app-shell.tsx`, `src/index.css`, `src/features/**/*.tsx`
- Test: `src/components/app-shell.test.tsx`

**Interfaces:**
- Consumes all routes and screen components.
- Produces a 360px–768px responsive shell that preserves the updated Figma hierarchy.

- [ ] **Step 1: Write the failing responsive-shell test**

```tsx
it("uses the fluid tablet app canvas", () => {
  render(<AppShell><div>content</div></AppShell>)
  expect(screen.getByTestId("app-canvas")).toHaveClass("app-canvas")
})
```

- [ ] **Step 2: Verify the test fails**

Run: `npm run test -- --run src/components/app-shell.test.tsx`

Expected: FAIL because AppShell does not exist.

- [ ] **Step 3: Implement width rules and visual alignment**

Create `AppShell` with `data-testid="app-canvas"`. In CSS use `width: min(100%, 768px)` on tablet and desktop, preserve mobile full width through 402px, and center the canvas only above 768px. Ensure cards, tabs, fields, coupon lists and headers grow fluidly without multi-column rules. Compare each Figma node at 402px: `5:625`, `5:2336`, `5:2678`, `5:2952`, `35:38`, `37:334`, `37:7193`, `37:4992`, `37:6532`, `37:6812`, `42:2731`, `42:2853`, `42:3211`, `42:1110`, and `42:1466`.

- [ ] **Step 4: Run final verification and commit**

```bash
npm run test -- --run
npm run build
git diff --check
git add src
git commit -m "style: align GreenBite member pages responsively"
```

Expected: all tests and the production build pass; diff check has no whitespace errors.

## Plan self-review

- Spec coverage: Tasks 1–6 cover HashRouter, typed mock APIs, all updated Figma pages and states, mobile/tablet/desktop width rules, local profile changes, tests, and visual validation.
- Placeholder scan: no deferred requirement or ambiguous implementation step remains.
- Type consistency: Task 1 owns every data type and repository signature consumed by Tasks 2–5; Task 6 only consumes existing route components.

