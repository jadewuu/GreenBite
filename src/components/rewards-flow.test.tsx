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
