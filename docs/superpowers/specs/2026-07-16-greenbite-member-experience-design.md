# GreenBite member experience expansion design

## Goal

Expand the existing GreenBite frontend into every screen and interaction state in the updated Figma section `5:3117`. The experience remains mobile-web first, uses frontend mock data for demonstrations, and exposes replaceable API boundaries for a future backend.

## Scope

- Preserve and update the existing Landing, Login, Verification, and Success flow.
- After valid verification, route `View Rewards` to the Rewards home screen.
- Implement these Figma screens and states: Member Code, Rewards, scrolled Rewards, alternate Rewards tab state, Rewards empty state, Account, Language, Points, Coupon, Complete Information step 1, and Complete Information step 2.
- Implement every interaction state represented by those Figma artboards, not static views only.
- Use local mock data and runtime mutations for the demonstration.
- Define frontend API interfaces that local mock implementations satisfy; do not connect a real backend.

## Navigation and interaction model

- Use HashRouter so every app screen has a browser address and Back behavior while remaining compatible with GitHub Pages.
- Landing -> Login -> Verification -> Success -> Rewards is the primary new-member path.
- Rewards header opens Account. The member-code entry opens Member Code. The points summary opens Points. Coupon entries and the coupon tab open Coupon.
- Rewards tabs, scrolled content, alternate tab state, and the empty state are interactive local state variants.
- Account opens Language and Complete Information. The profile form has required-field validation, advances through two steps, and updates the displayed local member record on success.
- Language selection updates local interface language state. English is the initial demonstration language.
- Member Code supports opening and closing the code view and provides local-only Add to Apple Wallet feedback. It does not create a real Wallet pass.

## Data boundaries

- `memberApi`: current member, member code, profile update, language update.
- `rewardsApi`: points balance, points history, and rewards state.
- `couponsApi`: coupon list and coupon state.
- `authApi`: existing simulated phone verification behavior.
- Each module exposes typed asynchronous methods and is backed by deterministic local fixture data. Page components do not import fixtures directly.

## Responsive behavior

- Mobile web is the primary target at 360px through 402px widths.
- At tablet widths, content expands fluidly up to a 768px maximum content width. Cards, rows, form fields, tabs, and coupon lists stretch with the canvas while preserving their single-column hierarchy.
- Above the tablet maximum, the application remains a centered app canvas rather than changing into a multi-column desktop dashboard.
- The 402px Figma artboards are the visual reference. Enlarged widths preserve spacing ratios and usable tap targets rather than applying a uniform visual scale.

## UI and implementation constraints

- Reuse the existing React, TypeScript, Tailwind, shadcn/ui, Satoshi typography, Figma assets, and GitHub Pages-compatible Vite configuration.
- Do not introduce another UI library or a backend.
- Keep all existing phone validation and fixed `123456` OTP behavior.
- Preserve the existing Figma visual language: dark green text, citrus accent, white surfaces, neutral dividers, rounded controls, and a single-column mobile hierarchy.

## Validation

- Unit-test mock API methods and form validation.
- Integration-test the primary authentication-to-rewards path, page navigation, tab and empty-state transitions, profile completion, language selection, and member-code open/close behavior.
- Test responsive layout behavior at 360px, 402px, and 768px widths.
- Build successfully and visually compare every implemented Figma screen at the 402px reference width.

## Non-goals

- Real SMS, real account persistence, production authentication, real Wallet passes, payment processing, live coupon redemption, or a multi-column desktop dashboard.

