import { act, cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { AppRouter } from "@/router"
import { rewardsApi } from "@/lib/api/rewards-api"

describe("Rewards routes", () => {
  beforeEach(async () => {
    await rewardsApi.setRewardsState("available")
    window.history.replaceState(null, "", "#/rewards")
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it("renders the Points activity state from the rewards API and switches to coupons", async () => {
    const user = userEvent.setup()
    const getActivities = vi.spyOn(rewardsApi, "getActivities")
    render(<AppRouter />)

    await user.click(await screen.findByRole("tab", { name: "Coupons" }))
    expect(screen.getAllByRole("article")).toHaveLength(3)
    await user.click(screen.getByRole("tab", { name: "Points" }))

    expect((await screen.findAllByText("HKC(RH)"))[0]).toBeVisible()
    expect(screen.getByText("+28 points")).toBeVisible()
    expect(getActivities).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole("button", { name: "Show empty rewards" }))
    expect(screen.getByText("No Rewards & Coupon")).toBeVisible()
  })

  it("uses routed navigation and preserves browser Back after closing member code", async () => {
    const user = userEvent.setup()
    render(<AppRouter />)

    await user.click(await screen.findByRole("button", { name: "Show Member Code" }))
    expect(await screen.findByRole("heading", { name: "Member Code" })).toBeVisible()
    expect(window.location.hash).toBe("#/member-code")
    await user.click(screen.getByRole("button", { name: "Close member code" }))
    expect(await screen.findByRole("heading", { name: "Rewards & Coupon" })).toBeVisible()

    const historyNavigation = new Promise<void>((resolve) => {
      const done = () => resolve()
      window.addEventListener("popstate", done, { once: true })
      window.addEventListener("hashchange", done, { once: true })
    })
    await act(async () => window.history.back())
    await historyNavigation

    await waitFor(() => expect(screen.queryByRole("heading", { name: "Member Code" })).not.toBeInTheDocument())
    expect(screen.getByRole("heading", { name: "Rewards & Coupon" })).toBeVisible()
  })

  it("routes the account action to its addressed screen", async () => {
    const user = userEvent.setup()
    render(<AppRouter />)

    await user.click(await screen.findByRole("button", { name: "Open account" }))
    expect(await screen.findByRole("heading", { name: "Account" })).toBeVisible()
  })

  it("routes points and coupon actions to their addressed screens", async () => {
    const user = userEvent.setup()
    const { unmount } = render(<AppRouter />)

    await user.click(await screen.findByRole("button", { name: "1,230 points" }))
    expect(await screen.findByRole("heading", { name: "Points" })).toBeVisible()
    unmount()

    window.history.replaceState(null, "", "#/rewards")
    render(<AppRouter />)
    await user.click(await screen.findByRole("tab", { name: "Coupons" }))
    await user.click(screen.getByRole("button", { name: "View Spend $20, Save $5" }))
    expect(await screen.findByRole("heading", { name: "Coupon" })).toBeVisible()
  })

  it.each([
    ["Points", async (user: ReturnType<typeof userEvent.setup>) => user.click(await screen.findByRole("button", { name: "1,230 points" }))],
    ["Coupon", async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(await screen.findByRole("tab", { name: "Coupons" }))
      await user.click(screen.getByRole("button", { name: "View Spend $20, Save $5" }))
    }],
  ])("does not reopen %s after detail Back followed by browser Back", async (title, openDetail) => {
    const user = userEvent.setup()
    render(<AppRouter />)

    await openDetail(user)
    expect(await screen.findByRole("heading", { name: title })).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Back" }))
    expect(await screen.findByRole("heading", { name: "Rewards & Coupon" })).toBeVisible()

    const historyNavigation = new Promise<void>((resolve) => {
      const done = () => resolve()
      window.addEventListener("popstate", done, { once: true })
      window.addEventListener("hashchange", done, { once: true })
    })
    await act(async () => window.history.back())
    await historyNavigation

    await waitFor(() => expect(screen.queryByRole("heading", { name: title })).not.toBeInTheDocument())
  })
})
