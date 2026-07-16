# GreenBite Figma Clean-room Design

## Goal

Replace the current visual implementation with a clean-room React implementation that reproduces the approved Figma section `5:3117` at its native `402 × 874` frame size while preserving the existing local mock APIs and route flow.

## Source of truth

- Figma file: `qYKbCc5BA6JAF74O8563w5`.
- Required frames: `5:625`, `5:2336`, `5:2678`, `5:2952`, `35:38`, `37:334`, `37:7193`, `37:4992`, `37:6532`, `37:6812`, `42:2731`, `42:2853`, `42:3211`, `42:1110`, `42:1466`.
- Each frame must be fetched with both design context and screenshot before implementation.
- Figma-provided assets must be committed locally. No Lucide or substitute art may appear in the rendered clean-room UI.

## Clean-room boundary

- Create a new UI tree under `src/figma-app/` and a new asset directory under `src/assets/figma-clean/`.
- Replace the application entry to render only the new tree.
- Do not import existing screen components or existing GreenBite page CSS.
- Existing `src/lib/api/*` typed local mock APIs may be reused without visual dependencies.
- Existing UI files remain temporarily in the repository only to reduce migration risk; they must be unreachable from the new entry.

## Responsive contract

- At `402 × 874`, landmarks, typography, colors, borders, radii, imagery, and scroll positions match the Figma frames.
- Between `360` and `402` pixels, the 402-pixel coordinate system scales fluidly to the viewport width while preserving proportions and tap targets.
- Above 402 pixels, the application remains a centered 402-pixel single-column canvas. No tablet or desktop re-layout.

## Functional contract

- English-only demo.
- Landing → Login → Verification → Success → Rewards.
- Ten-digit phone input; OTP `123456`; resend state retained.
- Rewards available, scrolled, alternate-tab, and empty states are reachable through visible production interactions represented by Figma.
- Member Code, Account, Language, Points, Coupon, and Information screens are routed and interactive.
- Language persists locally but does not translate the demo.
- All data is loaded and saved through the existing typed async mock APIs; no direct fixture imports in view components.

## Acceptance

- Every required frame has an implementation route/state and a 402 × 874 comparison capture.
- A visual reviewer checks each capture against its Figma screenshot and rejects invented UI or structural substitutions.
- Full tests and production build pass before merge and deployment.
