# GreenBite Rewards mobile flow design

## Goal

Create a responsive frontend-only GreenBite Rewards flow that matches the four supplied Figma mobile screens: Landing Page, Login, Verification, and Success. The implementation uses Vite, React, TypeScript, Tailwind CSS, and shadcn/ui.

## Scope

- Create a new Vite React TypeScript app in this empty workspace.
- Use shadcn/ui primitives for buttons, inputs, cards, and toast feedback.
- Reproduce the supplied 402 by 874 Figma layouts with the design assets from Figma.
- Implement the screen sequence: Landing -> Login -> Verification -> Success.
- Keep all state in the browser. No backend, authentication provider, or account persistence is included.

## Screen behavior

### Landing Page

- Show the GreenBite image, reward benefits, and two calls to action from Figma.
- `Join Rewards` and `Already a member? Sign in` both open Login.

### Login

- Accept a US phone number after a fixed `+1` prefix.
- Strip non-numeric characters, format the displayed number, and enable Continue only after ten digits are entered.
- Continue stores the phone number for the verification screen and opens Verification.
- Back returns to Landing.

### Verification

- Display the formatted phone number from Login.
- Accept six OTP digits using six single-character fields, advancing focus as each digit is entered and supporting backspace navigation.
- The only simulated valid code is `123456`; any other completed code shows an inline error and clears the entry.
- A 31-second resend countdown is visible. Resend becomes available at zero, restarts the countdown, clears the code, and shows toast feedback.
- Back returns to Login while retaining the entered phone number.

### Success

- Show the Figma success screen and its decorative image crops.
- `View Rewards` resets the transient flow and returns to Landing because no rewards screen exists in the supplied scope.
- `Add to Apple Wallet` provides local toast feedback only; it does not attempt a real Apple Wallet pass integration.

## Layout and visual system

- The primary viewport matches the 402px wide Figma artboards. On larger displays, it is centered inside a calm application background; on smaller displays, it fills the available width.
- Use Figma assets for photography, logos, and bespoke icons. Use the established dark green foreground, pale citrus accent, white surfaces, pill controls, and thin neutral borders.
- Use Satoshi when available through a hosted font import, with a system sans-serif fallback.
- Preserve the Figma spacing rhythm: 20px horizontal page padding, 32px vertical sections, 48px primary controls, and 12px OTP controls.

## Component boundaries

- `RewardsFlow`: owns screen state, phone number, OTP state, and resend timer.
- `LandingScreen`, `LoginScreen`, `VerificationScreen`, and `SuccessScreen`: render one Figma screen each and receive only necessary callbacks/state.
- shadcn/ui `Button`, `Input`, and toast primitives provide interaction behavior and accessibility while screen components own Figma-specific layout.

## Validation

- Build succeeds with TypeScript checking.
- Manual browser check confirms each navigation path, invalid phone state, invalid OTP state, valid `123456` success transition, resend countdown, and both Success actions.
- Compare the running page to all four Figma screenshots at the 402px mobile breakpoint.

## Non-goals

- No real SMS sending, OTP provider, user records, reward account API, routing framework, Apple Wallet pass, or unrelated pages.
