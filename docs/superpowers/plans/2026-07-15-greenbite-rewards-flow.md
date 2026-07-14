# GreenBite Rewards Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Figma-matched frontend-only mobile flow for Landing, Login, Verification, and Success.

**Architecture:** `RewardsFlow` owns the active screen, phone number, OTP, and resend timer. Each Figma screen is a focused component using shadcn/ui controls. Pure phone helpers contain the validation and formatting rules.

**Tech Stack:** Vite, React, TypeScript, Tailwind CSS, shadcn/ui, Vitest, Testing Library.

## Global Constraints

- Match the supplied 402px Figma artboards.
- Use shadcn/ui Button, Input, and toast primitives without another UI library.
- The app is frontend-only: ten US phone digits are required and `123456` is the only valid OTP.
- Do not add a backend, router, persistence, account API, or actual Apple Wallet integration.
- Use Figma-provided visual assets, never placeholders.

---

## File structure

- `src/lib/phone.ts`: normalize, validate, and format the phone number.
- `src/components/screens/*.tsx`: Landing, Login, Verification, and Success components.
- `src/components/rewards-flow.tsx`: state machine and shared app frame.
- `src/lib/phone.test.ts` and `src/components/rewards-flow.test.tsx`: unit and integration tests.
- `src/index.css`: Figma-specific mobile canvas and responsive styling.

### Task 1: Bootstrap the shadcn-enabled React app

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `components.json`, `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Create: `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/test/setup.ts`

**Interfaces:**
- Produces: `npm run dev`, `npm run build`, and `npm run test` for later tasks.

- [ ] **Step 1: Scaffold Vite and install the required packages**

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss @tailwindcss/vite vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install lucide-react sonner
npx shadcn@latest init -d
npx shadcn@latest add button input
```

Expected: Vite and generated shadcn files exist.

- [ ] **Step 2: Configure Vitest in jsdom**

Replace `vite.config.ts` with:

```ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: "./src/test/setup.ts" },
})
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest"
```

- [ ] **Step 3: Verify setup**

Run: `npm run build && npm run test -- --run`

Expected: production build passes and Vitest exits without failures.

- [ ] **Step 4: Commit bootstrap**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json components.json src
git commit -m "feat: bootstrap GreenBite rewards app"
```

### Task 2: Implement phone rules with tests

**Files:**
- Create: `src/lib/phone.ts`
- Test: `src/lib/phone.test.ts`

**Interfaces:**
- Produces: `digitsOnly(value: string): string`, `isUsPhoneNumber(value: string): boolean`, `formatUsPhoneNumber(value: string): string`.

- [ ] **Step 1: Write the failing helper tests**

```ts
import { describe, expect, it } from "vitest"
import { digitsOnly, formatUsPhoneNumber, isUsPhoneNumber } from "./phone"

describe("phone helpers", () => {
  it("keeps ten digits", () => expect(digitsOnly("(408) 888-12345")).toBe("4088881234"))
  it("requires ten digits", () => {
    expect(isUsPhoneNumber("4088881234")).toBe(true)
    expect(isUsPhoneNumber("408888123")).toBe(false)
  })
  it("formats a US number", () => expect(formatUsPhoneNumber("4088881234")).toBe("(408) 888-1234"))
})
```

- [ ] **Step 2: Verify the test fails**

Run: `npm run test -- --run src/lib/phone.test.ts`

Expected: FAIL because `./phone` is absent.

- [ ] **Step 3: Add the minimal helper implementation**

```ts
export function digitsOnly(value: string) {
  return value.replace(/\\D/g, "").slice(0, 10)
}

export function isUsPhoneNumber(value: string) {
  return /^\\d{10}$/.test(value)
}

export function formatUsPhoneNumber(value: string) {
  const digits = digitsOnly(value)
  if (digits.length < 4) return digits
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}
```

- [ ] **Step 4: Verify and commit the helpers**

Run: `npm run test -- --run src/lib/phone.test.ts`

Expected: PASS with three tests.

```bash
git add src/lib/phone.ts src/lib/phone.test.ts
git commit -m "feat: add phone number helpers"
```

### Task 3: Create the four Figma screen components

**Files:**
- Create: `src/components/screens/landing-screen.tsx`
- Create: `src/components/screens/login-screen.tsx`
- Create: `src/components/screens/verification-screen.tsx`
- Create: `src/components/screens/success-screen.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Produces: four components with these exact props:

```ts
type LandingScreenProps = { onJoin: () => void }
type LoginScreenProps = { phone: string; onPhoneChange: (value: string) => void; onBack: () => void; onContinue: () => void }
type VerificationScreenProps = { phone: string; onBack: () => void; onVerified: () => void }
type SuccessScreenProps = { onViewRewards: () => void; onAddToWallet: () => void }
```

- [ ] **Step 1: Build Landing and Success with supplied Figma assets**

Use the Figma URLs captured from nodes `5:625` and `5:2952`. Mark decorative images as `aria-hidden`. Use Button for every Figma action with exact labels: `Join Rewards`, `Already a member? Sign in`, `View Rewards`, and `Add to Apple Wallet`.

- [ ] **Step 2: Build Login behavior**

Use an Input with `inputMode="tel"`, a visible `+1` prefix, and `aria-label="Phone number"`. Normalize input with `digitsOnly`; disable Continue until `isUsPhoneNumber(phone)` returns true. Back calls `onBack`.

- [ ] **Step 3: Build OTP behavior**

Render six one-character numeric Inputs. On valid digit entry, focus the next input; on Backspace from an empty field, focus the previous input. After six digits, invoke `onVerified` only when the joined code is `123456`; otherwise render `Invalid verification code. Try 123456.` and clear every field. Run a `useEffect` interval for the Figma 31-second resend countdown and clean it up on unmount.

- [ ] **Step 4: Implement responsive Figma styling**

Create a 402px application canvas with 874px minimum height, 20px inline padding, `#0d1711` foreground, `#e9efcd` accent, neutral one-pixel borders, 48px main controls, 12px OTP controls, and 9999px primary-button radius. On smaller devices remove outer rounding and shadow; on desktop center the canvas in a neutral background.

- [ ] **Step 5: Visual check and commit**

Run: `npm run dev -- --host 127.0.0.1`

Expected: each component matches the matching Figma artwork at 402px width.

```bash
git add src/components/screens src/index.css
git commit -m "feat: add GreenBite rewards screens"
```

### Task 4: Connect the state machine and integration tests

**Files:**
- Create: `src/components/rewards-flow.tsx`
- Create: `src/components/rewards-flow.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: component contracts from Task 3.
- Produces: `RewardsFlow` mounted by `App`.

- [ ] **Step 1: Write failing flow tests**

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { RewardsFlow } from "./rewards-flow"

describe("RewardsFlow", () => {
  it("enables Continue for a valid number", async () => {
    const user = userEvent.setup()
    render(<RewardsFlow />)
    await user.click(screen.getByRole("button", { name: "Join Rewards" }))
    await user.type(screen.getByLabelText("Phone number"), "4088881234")
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled()
  })

  it("rejects a bad OTP and accepts 123456", async () => {
    const user = userEvent.setup()
    render(<RewardsFlow />)
    await user.click(screen.getByRole("button", { name: "Join Rewards" }))
    await user.type(screen.getByLabelText("Phone number"), "4088881234")
    await user.click(screen.getByRole("button", { name: "Continue" }))
    await user.type(screen.getAllByLabelText("Verification digit")[0], "000000")
    expect(await screen.findByText("Invalid verification code. Try 123456.")).toBeVisible()
    await user.type(screen.getAllByLabelText("Verification digit")[0], "123456")
    expect(await screen.findByText("You earned 28 points")).toBeVisible()
  })
})
```

- [ ] **Step 2: Verify tests fail**

Run: `npm run test -- --run src/components/rewards-flow.test.tsx`

Expected: FAIL because `RewardsFlow` does not exist.

- [ ] **Step 3: Implement `RewardsFlow` state**

Use this state contract:

```ts
type Screen = "landing" | "login" | "verification" | "success"
const [screen, setScreen] = useState<Screen>("landing")
const [phone, setPhone] = useState("")
```

Render one screen at a time. Landing actions open Login; valid Login opens Verification; valid OTP opens Success; Back preserves phone; View Rewards returns to Landing and clears phone; Add to Apple Wallet calls a Sonner toast only.

- [ ] **Step 4: Mount and verify the application**

Set `src/App.tsx` to:

```tsx
import { RewardsFlow } from "./components/rewards-flow"

export default function App() {
  return <RewardsFlow />
}
```

Run: `npm run test -- --run && npm run build`

Expected: every test passes and Vite builds successfully.

- [ ] **Step 5: Commit the connected flow**

```bash
git add src/App.tsx src/components/rewards-flow.tsx src/components/rewards-flow.test.tsx
git commit -m "feat: implement simulated rewards enrollment"
```

### Task 5: Figma comparison and final verification

**Files:**
- Modify: `src/index.css` and `src/components/screens/*.tsx` only for measured visual mismatches.

- [ ] **Step 1: Capture the four app states at 402px**

Capture Landing, Login, Verification, and Success after entering `123456` in a 402px viewport.

- [ ] **Step 2: Compare to nodes `5:625`, `5:2336`, `5:2678`, and `5:2952`**

Correct only measurable image crop, control height, spacing, typography, color, border, and radius differences.

- [ ] **Step 3: Run final checks and commit**

```bash
npm run test -- --run
npm run build
git status --short
git add src/index.css src/components/screens
git commit -m "style: align rewards flow with Figma"
```

Expected: test and build pass, and the final commit contains only intentional Figma alignment changes.

## Plan self-review

- Spec coverage: all four screens, browser-only authentication, ten-digit phone validation, fixed OTP, resend state, Success actions, shadcn/ui, responsiveness, tests, and visual comparison are assigned to tasks.
- Placeholder scan: no unfinished or deferred requirement is present.
- Type consistency: Task 3 defines the screen props consumed by Task 4; Task 2 defines the exact helpers used by Login.

