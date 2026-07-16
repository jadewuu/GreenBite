import { readFileSync } from "node:fs"

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { couponsApi } from "@/lib/api/coupons-api"
import { memberApi } from "@/lib/api/member-api"
import { rewardsApi } from "@/lib/api/rewards-api"

import { FigmaApp } from "./app"

const rewardsCss = readFileSync("src/figma-app/styles/rewards.css", "utf8")

beforeEach(async () => {
  await rewardsApi.setRewardsState("available")
  window.location.hash = "#/rewards"
})

afterEach(() => { cleanup(); vi.restoreAllMocks() })

describe("latest Figma rewards flow", () => {
  it("renders the 69:1047 rewards frame from the local APIs", async () => {
    const getMember = vi.spyOn(memberApi, "getCurrent")
    const getOverview = vi.spyOn(rewardsApi, "getOverview")
    const listCoupons = vi.spyOn(couponsApi, "listRewards")
    render(<FigmaApp />)
    expect(await screen.findByText("How it works")).toBeVisible()
    expect(document.querySelector('[data-figma-node="69:1047"]')).toBeInTheDocument()
    expect(screen.getByText("Earn points every visit")).toBeVisible()
    expect(screen.getByText("Reward for new register")).toBeVisible()
    expect(screen.getByText("Unlock free rewards")).toBeVisible()
    expect(screen.getByRole("tab", { name: "Rewards" })).toHaveAttribute("aria-selected", "true")
    expect(getMember).toHaveBeenCalledTimes(1)
    expect(getOverview).toHaveBeenCalledTimes(1)
    expect(listCoupons).toHaveBeenCalledTimes(1)
  })

  it("switches to the latest 73:1507 coupon layout", async () => {
    const user = userEvent.setup()
    render(<FigmaApp />)
    await user.click(await screen.findByRole("tab", { name: "Coupon" }))
    expect(document.querySelector('[data-figma-node="73:1507"]')).toBeInTheDocument()
    expect(screen.getByText("Spend $20, Save $5")).toBeVisible()
    expect(screen.getByText("Earn points every visit")).toBeVisible()
    expect(screen.queryByText("Reward for new register")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Claim Spend $20, Save $5" })).toBeVisible()
  })

  it("keeps the 37:7193 scrolled state free of summary cards", async () => {
    render(<FigmaApp />)
    const surface = await screen.findByTestId("rewards-scroll-surface")
    fireEvent.scroll(surface, { target: { scrollTop: 300 } })
    await waitFor(() => expect(document.querySelector('[data-figma-node="37:7193"]')).toBeInTheDocument())
    expect(screen.queryByText("Show Member Code")).not.toBeInTheDocument()
    expect(screen.queryByText("How it works")).not.toBeInTheDocument()
  })

  it("opens the member card and keeps the demo rewards screen visible after Claim", async () => {
    const user = userEvent.setup()
    render(<FigmaApp />)
    await user.click(await screen.findByRole("button", { name: "Show Member Code" }))
    expect(document.querySelector('[data-figma-node="35:38"]')).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Close member code" }))
    await user.click(await screen.findByRole("tab", { name: "Coupon" }))
    await user.click(screen.getByRole("button", { name: "Claim Spend $20, Save $5" }))
    expect(screen.getByText("Spend $20, Save $5")).toBeVisible()
    expect(document.querySelector('[data-figma-node="37:6532"]')).not.toBeInTheDocument()
  })

  it("uses the exact two-tab layout and 44px account target", () => {
    expect(rewardsCss).toMatch(/\.reward-tabs-clean\s*\{[\s\S]*?height:\s*40px/)
    expect(rewardsCss).toMatch(/\.reward-tabs-clean button\s*\{[\s\S]*?width:\s*50%/)
    expect(rewardsCss).toMatch(/\.rewards-account-button\s*\{[\s\S]*?width:\s*44px;[\s\S]*?height:\s*44px/)
    expect(rewardsCss).toMatch(/\.how-it-works\s*\{[\s\S]*?border-radius:\s*16px/)
  })
})
