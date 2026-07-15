# GreenBite Figma visual audit

Audit target: Figma file `qYKbCc5BA6JAF74O8563w5`, section `5:3117`. All 15 source frames are **402 × 874 px**. Measurements below are Figma coordinates at that frame size; use them as the visual acceptance contract.

## Shared implementation contract

| Token | Figma value | Required code location |
| --- | --- | --- |
| Canvas | 402 px wide, white, no desktop re-layout | `src/components/app-shell.tsx`, `src/index.css`: make the canvas `width: min(100%, 402px)` above the mobile range; do not retain the current 768 px canvas. |
| Page gutters | 20 px (`x=20`, content width 362 px); Member Code card alone uses 16 px (`x=16`, width 370 px) | Replace the mixed margins/paddings in `src/index.css` with the frame values per screen. |
| Header | `y=32`, height 44; back/icon target 34 × 44 with 24 px icon centered; centred title is 20/24/700 | Create one `figma-detail-header` rule used by account, language, points, coupon, information and member-code routes. The current `detail-header` begins at y=0 and is 92 px tall, which is not the Figma header. |
| Colour | foreground `#0D1711`; body copy `#4A524C`; muted `#8E8E8E`; page fill `#F5F5EE`; secondary `#E9EFCD`; dark CTA `#060A08`; separator `#E2E2E2` or `#F1F1EB` as noted | Retain these as the only visual tokens in `src/index.css`; remove the unrelated summary/card greens such as `#D2DD99`, `#234C35`, `#4D6135`, and `#73603D` except where the Figma calls for `#D2DD99` (Member Code strip). |
| Type | Satoshi throughout. Heading 1: 48/52/700/-1.5; Heading 3: 24/28.8/700/-1; Heading 4: 20/24/700; body: 16/24 (500 or 700); small: 14/20; mini: 13/18 | `src/index.css` currently imports Satoshi but `@theme` still declares Geist. Set the application font tokens to Satoshi and eliminate Geist as the page font. |
| Controls | Primary/outline CTA: 362 × 48, 9999 px radius; form field: 362 × 56; OTP: 48 × 48, 8 px gaps | Keep the existing shadcn primitives but override only their GreenBite classes. |

## Screen-by-screen corrections

### 1. Landing — `5:625`

Figma geometry: hero image `x=37 y=27 w=365 h=440`; logo group `x=20 y=32 w=156 h=32`; title `x=20 y=96 w=244 h=208`; description `x=20 y=336 w=214 h=40`; benefits container `x=20 y=408 w=362 h=169` (two 44 px rows at y=432 and y=509, divider y=492); CTAs y=609 and y=673; helper text y=737.

- In `src/components/screens/landing-screen.tsx`, split `Benefit` into real content props: the second row must be **“Unlock free rewards”** / **“Redeem points for free and drinks”**, not a duplicate of the first row.
- In the same file, replace all four prior-run asset URLs with the current node `5:625` assets before visual comparison; do not approximate the hero with `.landing-hero::after`. The source hero is a 365 × 440 Figma image and must crop exactly at that box.
- In `src/index.css`, make `.landing-logo` 156 × 32 (the current 152 × 28.5 is visibly undersized). Preserve the h1 and copy dimensions already close to spec, then set fixed section positions/gaps so the first benefit begins at y=432 and actions at y=609. Current flex accumulation is about 3–4 px early.

### 2. Login — `5:2336`

Figma geometry: back control `x=20 y=32`; brand `x=133.5 y=108 w=135 h=80` (mark 53 × 48, wordmark 135 × 20); title `x=99 y=220 w=204 h=72`; phone field `x=20 y=324 w=362 h=56`; CTA `x=20 y=412 w=362 h=48`; legal copy `x=20 y=794 w=362 h=40`.

- `src/index.css`: do not use one `gap: 32px` flex stack for this screen. Add a login-specific layout: the title, field and CTA must land at y=220/324/412; anchor `.login-terms` at `bottom: 40px` (y=794), rather than directly after the CTA.
- `src/components/screens/login-screen.tsx`: replace the old arrow/brand sources with exact `5:2336` Figma assets. Keep the copy exactly as shown in the source (“By logging in, you agree to the our …”).
- The current `.brand` is 48 × 40 + 122 × 20; it must be 53 × 48 + 135 × 20 for auth screens.

### 3. Verification — `5:2678`

Figma geometry: back y=32; brand y=108; title `x=85 y=220 w=232 h=36`; copy `x=66 y=288 w=270 h=40`; OTP row `x=37 y=360 w=328`, six 48 px boxes at x=37, 93, 149, 205, 261, 317; resend control occupies `x=139.5 y=440 w=123 h=60`, label/button y=464 h=36.

- `src/index.css`: use a verification-specific layout. The current shared centered stack places title/copy/OTP about 8 px too high and resend too high. Set their exact y positions or equivalent explicit margins.
- Keep the existing verification interaction and error state, but make error copy an overlay below OTP so it does not push the resend control away from y=464.
- `src/components/screens/verification-screen.tsx`: update the three design assets from node `5:2678`; retain the current 6-digit and resend logic.

### 4. Success — `5:2952`

Figma geometry: two confetti images 151 × 148 at `(0,0)` and `(251,0)`; badge `x=161 y=83 80×80`; title `x=120 y=195 162×72`; purchase line `x=109 y=299 184×20`; status line `x=109 y=351 184×40`; buttons `x=20 y=423` and `x=20 y=487`, each 362×48.

- `src/components/screens/success-screen.tsx`: change the copy to **“Purchase #ORD00123456”** and **“Points will appear in your account within 48 hours”**. Replace “Add to Apple Wallet” with Figma’s outline **“Check Details”** action. Keep its action handler local/demo-safe.
- `src/index.css`: the current uniform 32 px success stack puts copy and buttons too high. Keep badge/title at y=83/195; explicitly add the 32 px then 32 px/52 px rhythm necessary for text at y=299/y=351 and actions y=423.
- Replace existing success image URLs with node `5:2952` sources; left/right confetti must not be a single reused crop unless it matches both source images.

### 5. Rewards available and scrolled — `37:334`, `37:7193`, `37:4992`

Figma home geometry: header is logo/account only, `x=20 y=32 w=362 h=44` (logo 156×32 at x=20 y=38; profile icon 24×24 at x=348 y=42). There is **no “Rewards & Coupon” title in this header**. The membership card is `x=20 y=100 w=362 h=226`: code row h=36, then member area h=190. The title “Rewards & Coupon” is `x=20 y=350`, tabs begin y=390 h=40, first reward row y=446 h=88, then y=550/654/758/862 at 104 px intervals.

- Rewrite `src/features/rewards/rewards-page.tsx` markup around the source hierarchy: `rewards-topbar`, a 36 px “Show Member Code” row with QR at x=330, a 190 px dark member panel, then the section title and reward list. Remove the current centered title header and pale 20 px-radius `.member-summary` card.
- Replace `src/features/rewards/reward-tabs.tsx` with a horizontally scrollable, left-aligned 40 px line tab strip: base border bottom `#F1F1EB`, 24 px inter-tab gaps, labels 16/24; selected tab has 2 px `#0D1711` bottom border. The current two-column segmented pill is not in the design.
- Rewrite `src/features/rewards/coupon-card.tsx` as a transparent 362×88 horizontal row: offer tile 88×88, `#F5F5EE`, 8 px radius; 12 px gap; 16/24 item name; 14/20 metadata; optional claim is 32 px tall `#E9EFCD` pill. Remove the current 174 px coloured promotional-card treatment.
- `37:7193` is the scrolled state: header/card are absent and tabs are at `x=20 y=100`; first row y=156. Add a scroll threshold that switches to this compact top state rather than merely adding a header shadow (`.rewards-home-scrolled` today).
- `37:4992` confirms the tab strip is horizontally overflowing (638 px total) and has named categories, not only “Points/Coupons”. Model available mock data as `Coupon`, `Lunch Item`, `Base Item`, `Drinks`, `Mini Bowlo` and further horizontal items; preserve stateful selection.

### 6. Rewards empty — `37:6532`

Figma keeps the same logo/account header y=32 and member card y=100–326. Empty asset block is centered at `x=151 y=496 w=100 h=100`: source illustration 64×64 at x=169 y=496; title **“No Rewards & Coupon”** at x=126.5 y=576, 149×20. No explanatory sentence and no “Show rewards” CTA appear in the frame.

- `src/features/rewards/rewards-page.tsx`: render the same home header/card in the `overview.state === "empty"` branch, then the Figma illustration/title. Keep the demo recovery interaction visually hidden or accessible from a development-only interaction, not as visible product UI.
- `src/index.css`: remove `.empty-reward-mark` star circle, 180 px top padding, generic paragraph and underline CTA. Use the node `37:6532` illustration asset.

### 7. Member Code — `35:38`

Figma geometry: title header y=32; card `x=16 y=100 w=370 h=538`, 24 px radius, 1 px `rgba(0,0,0,.35)` border, `0 -1px 25px rgba(0,0,0,.15)` shadow. Strip is 370×160 `#D2DD99`. Member fields x=51/y=282 equivalent card-local x=35/y=180, QR image 160×160 card-local x=105/y=247, member ID y=435, official Apple Wallet asset x=51/y=555 w=300 h=52. Floating close is 48×48 at x=177 y=678.

- `src/features/rewards/member-code-page.tsx`: replace the CSS-generated QR and text wallet button with Figma’s supplied QR / Apple Wallet assets. It must show the Figma member-code number, not `GB12345678`, under the QR.
- `src/index.css`: move `.member-code-card` to y=100 (current y=150 from 62 px margin after an 88 px header); card must be 370×538. Move the close control out of the header to its required floating position; the header right slot is empty.
- Keep the existing toast behavior only behind the official wallet artwork click.

### 8. Account — `37:6812`

Figma geometry: header y=32; profile block x=20 y=92 w=362 h=88, avatar image x=20 y=104 64×64, name x=92 y=113, member-since x=92 y=141; menu x=20 y=200 w=362 h=170, three 56 px rows separated at y=256 and y=313; sign-out x=20 y=762 w=362 h=48.

- `src/features/profile/account-page.tsx`: replace the yellow initial avatar with Figma’s `Image (Andrew)` asset. Omit the email line: it is not in the source frame. Use the Figma arrow/icon assets rather than a text left arrow.
- `src/index.css`: remove `.profile-menu` rounded/fill container. It is a white full-width row group with 1 px separators; position it at y=200. Set the footer CTA to y=762 (currently bottom 64 produces a different coordinate on the 874 px reference).

### 9. Language — `42:2731`

Figma geometry: header y=32; list x=20 y=92 w=362 h=170; three rows 56 px high, separators y=148/205. The Figma item component is a plain white row with end selection state, not a rounded grey fieldset.

- `src/features/profile/language-page.tsx`: retain persistence and English-only demo behavior, but use the Figma back asset and item/right-check asset.
- `src/index.css`: remove the 32 px `margin-top` on `.language-list` (it currently begins y=124); set y=92, no rounded background, 56 px rows and `#E2E2E2` separators.

### 10. Points — `42:2853`

Figma geometry: header y=32–76; scroll content begins y=76. Month header **“July 2026”** is x=20 y=84 (its 402×40 container starts y=92); payment rows are full-bleed 402×84 at y=132, 216, 300. **“June 2026”** begins y=392; following rows are y=432, 516, 600, 684, 768, 852, 936.

- `src/features/rewards/points-page.tsx`: change each activity into a single 84 px `payment` row matching the Figma data hierarchy and preserve the full-bleed x=0 layout. Do not use the current two-row grid with date/merchant then Purchase/points.
- `src/index.css`: set `detail-header` height to 76; month container h=40 and rows h=84 with 20 px content inset. Replace `.points-detail-row` grid/bottom-border styling with the Figma payment-row primitives.

### 11. Coupon detail — `42:3211`

Figma geometry: header y=32–76; list container starts y=76; rows are x=20 y=92/196/300/404/508, each 362×88, 16 px vertical rhythm (104 px step).

- `src/features/rewards/coupons-page.tsx`: use the same 88 px Figma reward-row component as home, not the current three-column **offer / copy / Use** construction. Figma does not show a “Use” pill in this frame.
- `src/index.css`: make the detail list start 16 px below the 76 px header and use 16 px gaps; remove `.coupon-detail-offer` and its artificial 88 px offer tile unless the Figma row asset/data supplies one.

### 12. Complete information, both states — `42:1110`, `42:1466`

Both Figma states have the common header y=32–76 and form x=20 y=92 w=362. Exact vertical landmarks: phone field h=69 at y=92; intro y=181 h=20; name pair y=221 h=69 (175 px / 12 px / 175 px); date y=310 h=69; email y=399 h=69; checkbox group y=488 h=40; CTA y=548 h=48. Node `42:1466` is the second state and has identical geometry; it must only change the allowed review/edit control state, not rearrange the form.

- `src/features/profile/information-page.tsx`: retain the two-stage validation/save flow. Add field-label / 44 px input composition to exactly total 69 px; make the paired fields 175 px with a 12 px gap (current equal columns have 10 px gap). The Figma flow requires both stages to use the same spatial grid.
- `src/index.css`: align `.information-form` to y=92, 20 px vertical gaps between the 69 px fields/intro blocks, checkbox fixed h=40, CTA y=548. Remove the current `profile-last-name` 25 px top padding workaround and use real labels/field heights.

## Required asset handling

Do not introduce an icon library for replacement visuals. The current app imports Lucide across Rewards/Profile; replace those rendered icons with the node assets returned by the Figma design context (logo, account, QR, chevrons, arrows, close, empty illustration, profile image, member QR, Apple Wallet artwork). Asset URLs are short-lived, so download them into a committed local asset directory during the implementation pass and reference those files from components.

## Acceptance capture checklist

At 402 × 874, capture and compare these routes/states before push: `/`, `/login`, `/verify`, `/success`, `/rewards` initial, `/rewards` after list scroll, `/rewards` empty, `/member-code`, `/account`, `/language`, `/points`, `/coupons`, `/information/1`, `/information/2`. A screen is not visually accepted if any listed x/y/width/height landmark differs by more than 2 px or uses a substitute visual instead of its Figma asset.
