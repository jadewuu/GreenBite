import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { AppRouter } from "@/router"

afterEach(cleanup)
beforeEach(() => {
  window.location.hash = ""
})

describe("member authentication routes", () => {
  it("routes a verified member to rewards", async () => {
    const user = userEvent.setup()
    render(<AppRouter />)

    await user.click(screen.getByRole("button", { name: "Join Rewards" }))
    await user.type(screen.getByLabelText("Phone number"), "4088881234")
    await user.click(screen.getByRole("button", { name: "Continue" }))

    await user.type(screen.getAllByLabelText("Verification digit")[0], "123456")

    await user.click(await screen.findByRole("button", { name: "View Rewards" }))

    expect(await screen.findByRole("heading", { name: "Rewards & Coupon" })).toBeVisible()
  })

  it("restores the phone number when Back returns to login", async () => {
    const user = userEvent.setup()
    render(<AppRouter />)

    await user.click(screen.getByRole("button", { name: "Join Rewards" }))
    await user.type(screen.getByLabelText("Phone number"), "4088881234")
    await user.click(screen.getByRole("button", { name: "Continue" }))
    await user.click(screen.getByRole("button", { name: "Go back" }))

    expect(await screen.findByLabelText("Phone number")).toHaveValue("(408) 888-1234")
  })
})
