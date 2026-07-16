# GreenBite latest Figma replacement

## Source of truth

Use the latest frames in Figma file `qYKbCc5BA6JAF74O8563w5`, beginning at section `5:3117`. The prior clean-room implementation is only a code shell; any page whose new frame differs must be replaced rather than tuned to preserve its old arrangement.

## Updated page inventory

- Landing `5:625`: three benefit rows; one primary CTA and helper text.
- Auth/status: Login `47:836`/`5:2336`, Verification `5:2678`, Success-48h `5:2952`, Success-instant `64:1591`, Failed/already claimed `42:3899`.
- Rewards: new home `69:1047`, coupon-tab state `73:1507`, scroll state `37:7193`, empty state `37:6532`, member code `35:38`.
- Details: Profile `37:6812`, Language `42:2731`, Points `42:2853`, Coupon `42:3211`, Coupon Detail `66:2870`, Information steps `42:1110` and `42:1466`.

## Behaviour contract

- Keep the local typed API layer as the only source for member, reward, points and coupon demo data.
- Preserve explicit loading, empty, selected-tab, focus, validation, success, instant-success and already-claimed states. State pages are addressable via routes for review; normal interactions must not add visible controls not in Figma.
- Coupon cards open Coupon Detail; its close affordance returns to the coupon list. Existing back semantics remain browser-safe.
- At 360–402 px use native mobile flow. Wider displays center the same mobile canvas without a desktop re-layout.

## Verification contract

- For every changed node: fetch its own Figma design context and screenshot before coding; compare the rendered route at 402 px after coding.
- Update only tests whose expected copy/layout represents superseded Figma frames. Then run all tests, production build and whitespace diff checks.
