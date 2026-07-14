import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { RewardsFlow } from "./rewards-flow"

const { toast } = vi.hoisted(() => ({ toast: vi.fn() }))

vi.mock("sonner", () => ({
  Toaster: () => null,
  toast,
}))

afterEach(() => {
  vi.useRealTimers()
})

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

  it("confirms when a verification code is resent", async () => {
    vi.useFakeTimers()
    render(<RewardsFlow />)
    fireEvent.click(screen.getByRole("button", { name: "Join Rewards" }))
    fireEvent.change(screen.getByLabelText("Phone number"), { target: { value: "4088881234" } })
    fireEvent.click(screen.getByRole("button", { name: "Continue" }))
    fireEvent.change(screen.getAllByLabelText("Verification digit")[0], { target: { value: "1" } })

    for (let second = 0; second < 31; second += 1) {
      act(() => vi.advanceTimersByTime(1000))
    }

    fireEvent.click(screen.getByRole("button", { name: "Resend code" }))

    expect(screen.getAllByLabelText("Verification digit")[0]).toHaveValue("")
    expect(screen.getByRole("button", { name: "Resend in 31s" })).toBeDisabled()
    expect(toast).toHaveBeenCalledWith("Verification code resent.")
  })
})
