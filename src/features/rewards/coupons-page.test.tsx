import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { CouponsPage } from "./coupons-page"

describe("CouponsPage", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "#/coupons")
  })

  afterEach(cleanup)

  it("renders five coupon cards and returns with Back", async () => {
    const user = userEvent.setup()
    render(<CouponsPage />)

    expect(await screen.findAllByRole("article")).toHaveLength(5)
    await user.click(screen.getByRole("button", { name: "Back" }))

    expect(window.location.hash).toBe("#/rewards")
  })
})
