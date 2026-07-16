# Plan: latest GreenBite Figma implementation

1. **Lock updated source frames**
   - Fetch individual design context and screenshot for every changed frame.
   - Verify: node-specific references and a route/state map are recorded in the implementation brief.

2. **Replace Landing and auth/status views**
   - Replace the old Landing composition, and implement success-instant and already-claimed alongside the specified Login/Verification/Success states.
   - Verify: interaction tests and 402 px screenshots for each status route.

3. **Replace Rewards compositions**
   - Implement the latest Rewards home, coupon tab, scroll and empty variants from their current frames.
   - Verify: tabs, member code, account navigation, and coupon actions work without retaining the older reward layout.

4. **Replace updated detail views**
   - Rebuild Profile, Language, Coupon and Coupon Detail; retain Points and Information only where their latest frames match.
   - Verify: API-fed values, back/close actions, focus/validation states and 402 px screenshots.

5. **Visual and release gate**
   - Compare every listed route against its Figma screenshot at 402 px; test 360 px and tablet centering.
   - Verify: test suite, build, `git diff --check`, independent review, then merge/push only after all are clean.
