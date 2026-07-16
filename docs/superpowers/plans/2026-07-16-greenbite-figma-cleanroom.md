# GreenBite Figma Clean-room Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Replace the current rendered UI with a clean-room, pixel-faithful implementation of all approved GreenBite Figma frames.

**Architecture:** A new `src/figma-app/` owns routing, page structure, and isolated CSS. It reuses only typed mock APIs and routes no existing visual components. Assets live under `src/assets/figma-clean/`.

**Tech Stack:** React, TypeScript, React Router, shadcn/ui primitives where they do not alter Figma appearance, Vitest, Vite.

## Global Constraints

- Exact source is Figma file `qYKbCc5BA6JAF74O8563w5`, section `5:3117`.
- Fetch design context and screenshot for each exact frame before editing.
- Native reference viewport is `402 × 874`; maximum canvas width is `402px`.
- No existing GreenBite page components or page CSS may be imported into the clean-room tree.
- No icon package or substitute artwork in rendered output; use committed Figma assets.
- Preserve typed async mock APIs and all functional interaction states.
- English-only UI.

---

### Task 1: Clean-room shell and authentication flow

**Files:**
- Create: `src/figma-app/app.tsx`
- Create: `src/figma-app/styles/tokens.css`
- Create: `src/figma-app/styles/auth.css`
- Create: `src/figma-app/pages/landing.tsx`
- Create: `src/figma-app/pages/login.tsx`
- Create: `src/figma-app/pages/verification.tsx`
- Create: `src/figma-app/pages/success.tsx`
- Create: `src/figma-app/auth-flow.test.tsx`
- Modify: `src/main.tsx`

**Interfaces:** Uses the existing auth behavior and produces routes `/`, `/login`, `/verify`, `/success`, with success continuing to `/rewards`.

- [ ] Fetch context and screenshots for `5:625`, `5:2336`, `5:2678`, `5:2952`, then commit their exact assets under `src/assets/figma-clean/auth/`.
- [ ] Write a failing route-flow test covering phone, OTP, success copy, and rewards continuation.
- [ ] Implement the isolated 402-pixel shell and four screens without importing existing visual components/CSS.
- [ ] Verify focused tests, full tests, build, and commit.

### Task 2: Rewards and Member Code states

**Files:**
- Create: `src/figma-app/styles/rewards.css`
- Create: `src/figma-app/pages/rewards.tsx`
- Create: `src/figma-app/pages/member-code.tsx`
- Create: `src/figma-app/rewards-flow.test.tsx`

**Interfaces:** Uses `memberApi`, `rewardsApi`, and `couponsApi`; produces `/rewards` and `/member-code` with available, scrolled, alternate-tab, and empty states.

- [ ] Fetch context and screenshots for `35:38`, `37:334`, `37:7193`, `37:4992`, `37:6532`, then commit exact assets under `src/assets/figma-clean/rewards/`.
- [ ] Write failing tests for each Figma interaction state and route.
- [ ] Implement the exact Figma hierarchy, horizontal tabs, rows, scroll transition, empty state, and Member Code.
- [ ] Verify focused tests, full tests, build, and commit.

### Task 3: Account, Language, Points, Coupon, and Information

**Files:**
- Create: `src/figma-app/styles/details.css`
- Create: `src/figma-app/pages/account.tsx`
- Create: `src/figma-app/pages/language.tsx`
- Create: `src/figma-app/pages/points.tsx`
- Create: `src/figma-app/pages/coupon.tsx`
- Create: `src/figma-app/pages/information.tsx`
- Create: `src/figma-app/details-flow.test.tsx`

**Interfaces:** Uses existing member/reward/coupon typed APIs; produces `/account`, `/language`, `/points`, `/coupons`, `/information/1`, `/information/2`.

- [ ] Fetch context and screenshots for `37:6812`, `42:2731`, `42:2853`, `42:3211`, `42:1110`, `42:1466`, then commit exact assets under `src/assets/figma-clean/details/`.
- [ ] Write failing tests for navigation, persistence, validation, and save.
- [ ] Implement the exact headers, rows, forms, fixed CTA positions, and Figma assets.
- [ ] Verify focused tests, full tests, build, and commit.

### Task 4: Visual acceptance and deployment gate

**Files:**
- Modify only clean-room files required by measured visual differences.
- Create: `docs/figma-cleanroom-acceptance.md`

**Interfaces:** Consumes all clean-room routes and Figma screenshots; produces final accepted captures and a deployment-ready main branch.

- [ ] Run the app and capture every required route/state at `402 × 874`.
- [ ] Compare each capture to the corresponding Figma screenshot and record exact discrepancies.
- [ ] Correct all visible discrepancies; do not waive invented structures or substitute assets.
- [ ] Re-capture, run full tests/build, perform whole-branch review, merge, push, and wait for GitHub Pages success.
