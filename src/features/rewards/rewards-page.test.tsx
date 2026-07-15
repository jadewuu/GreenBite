import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { RewardsPage } from "./rewards-page"

describe("RewardsPage", () => {
  it("switches tabs, opens the member code, and renders the empty state", async () => {
    const user = userEvent.setup()
    render(<RewardsPage />)

    await user.click(await screen.findByRole("button", { name: "Show Member Code" }))
    expect(screen.getByRole("heading", { name: "Member Code" })).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Close member code" }))
    await user.click(screen.getByRole("tab", { name: "Coupons" }))
    expect(screen.getAllByRole("article")).toHaveLength(5)
    await user.click(screen.getByRole("button", { name: "Show empty rewards" }))
    expect(screen.getByText("No Rewards & Coupon")).toBeVisible()
  })
})
