import { existsSync, readFileSync } from "node:fs"

import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { couponsApi } from "@/lib/api/coupons-api"
import { memberApi } from "@/lib/api/member-api"
import { rewardsApi } from "@/lib/api/rewards-api"
import phoneAsset from "@/assets/figma-clean/details/phone.svg"

import { FigmaApp } from "./app"
import { Information } from "./pages/information"

const detailsCssPath = "src/figma-app/styles/details.css"
const detailsCss = existsSync(detailsCssPath) ? readFileSync(detailsCssPath, "utf8") : ""
const calendarSvg = readFileSync("src/assets/figma-clean/details/calendar.svg", "utf8")
const phoneSvg = readFileSync("src/assets/figma-clean/details/phone.svg", "utf8")
const storage = new Map<string, string>()

beforeEach(async () => {
  storage.clear()
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      clear: () => storage.clear(),
      getItem: (key: string) => storage.get(key) ?? null,
      key: (index: number) => [...storage.keys()][index] ?? null,
      get length() { return storage.size },
      removeItem: (key: string) => storage.delete(key),
      setItem: (key: string, value: string) => storage.set(key, value),
    } satisfies Storage,
  })
  await memberApi.setLanguage("en")
  await memberApi.updateProfile({
    firstName: "John",
    lastName: "Hart",
    birthday: "1990-01-01",
    email: "john@example.com",
  })
  window.location.hash = "#/account"
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("Figma clean-room detail routes", () => {
  it("loads the exact Profile frame and routes each production row", async () => {
    const getCurrent = vi.spyOn(memberApi, "getCurrent")
    const user = userEvent.setup()
    render(<FigmaApp />)

    expect(await screen.findByRole("heading", { name: "Profile" })).toBeVisible()
    expect(document.querySelector('[data-figma-node="37:6812"]')).toBeInTheDocument()
    expect(screen.getByText("John H.")).toBeVisible()
    expect(screen.getByText("Member since Nov 27,2024")).toBeVisible()
    expect(getCurrent).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole("button", { name: "Points" }))
    expect(await screen.findByRole("heading", { name: "Points" })).toBeVisible()
    expect(window.location.hash).toBe("#/points")
  })

  it("renders Profile identity and member date from the member API response", async () => {
    const member = await memberApi.getCurrent()
    vi.spyOn(memberApi, "getCurrent").mockResolvedValue({ ...member, firstName: "Ava", lastName: "Stone", joinedAt: "2030-01-05" })
    render(<FigmaApp />)

    expect(await screen.findByText("Ava S.")).toBeVisible()
    expect(screen.getByText("Member since Jan 5,2030")).toBeVisible()
    expect(screen.queryByText("John H.")).not.toBeInTheDocument()
    expect(screen.queryByText("Member since Nov 27,2024")).not.toBeInTheDocument()
  })

  it("persists language selection while keeping the demo copy unchanged", async () => {
    const setLanguage = vi.spyOn(memberApi, "setLanguage")
    const user = userEvent.setup()
    render(<FigmaApp />)

    await user.click(await screen.findByRole("button", { name: "Language" }))
    expect(document.querySelector('[data-figma-node="42:2731"]')).toBeInTheDocument()
    await user.click(screen.getByRole("radio", { name: "中文（大陆）" }))

    expect(setLanguage).toHaveBeenCalledWith("zh")
    expect(screen.getByRole("heading", { name: "Language" })).toBeVisible()
    expect(screen.getByRole("radio", { name: "中文（大陆）" })).toBeChecked()

    await user.click(screen.getByRole("button", { name: "Back" }))
    await user.click(await screen.findByRole("button", { name: "Language" }))
    expect(await screen.findByRole("radio", { name: "中文（大陆）" })).toBeChecked()
  })

  it("loads the exact Points ledger through the rewards API", async () => {
    const getActivities = vi.spyOn(rewardsApi, "getActivities")
    window.location.hash = "#/points"
    render(<FigmaApp />)

    expect(await screen.findByText("Today, 04:30 PM")).toBeVisible()
    expect(document.querySelector('[data-figma-node="42:2853"]')).toBeInTheDocument()
    expect(screen.getByText("PENDING")).toHaveClass("point-status-clean")
    expect(screen.getAllByText("Purchase #ORD00123456").length).toBeGreaterThan(1)
    expect(screen.getAllByText("Payment #ORD00123456").length).toBeGreaterThan(1)
    expect(screen.getByText("July 2026")).toBeVisible()
    expect(screen.getByText("June 2026")).toBeVisible()
    expect(getActivities).toHaveBeenCalledTimes(1)
  })

  it("renders distinct and empty Points responses without page-local fallback rows", async () => {
    const getActivities = vi.spyOn(rewardsApi, "getActivities")
    getActivities.mockResolvedValueOnce([{
      id: "custom-point",
      date: "2031-09-03",
      merchant: "TEST(CH)",
      points: 777,
      kind: "earned",
      monthLabel: "September 2031",
      displayDate: "September 3, 09:15 AM",
      channel: "TEST(CH)",
      orderId: "CUSTOM0099",
      label: "Custom Earn",
      status: "Review",
    }] as Awaited<ReturnType<typeof rewardsApi.getActivities>>)
    window.location.hash = "#/points"
    render(<FigmaApp />)

    expect(await screen.findByText("September 2031")).toBeVisible()
    expect(screen.getByText("September 3, 09:15 AM")).toBeVisible()
    expect(screen.getByText("TEST(CH)")).toBeVisible()
    expect(screen.getByText("Custom Earn #CUSTOM0099")).toBeVisible()
    expect(screen.getByText("+777")).toBeVisible()
    expect(screen.getByText("REVIEW")).toBeVisible()
    expect(screen.queryByText("Today, 04:30 PM")).not.toBeInTheDocument()

    cleanup()
    getActivities.mockResolvedValueOnce([])
    window.location.hash = "#/points"
    render(<FigmaApp />)
    expect(await screen.findByRole("heading", { name: "Points" })).toBeVisible()
    expect(screen.queryByText("July 2026")).not.toBeInTheDocument()
    expect(screen.queryByText("June 2026")).not.toBeInTheDocument()
    expect(screen.queryAllByTestId("point-row")).toHaveLength(0)
  })

  it("loads the latest three Coupon cards through the coupon API", async () => {
    const list = vi.spyOn(couponsApi, "list")
    window.location.hash = "#/coupons"
    render(<FigmaApp />)

    expect(await screen.findByRole("heading", { name: "Coupon" })).toBeVisible()
    expect(document.querySelector('[data-figma-node="42:3211"]')).toBeInTheDocument()
    expect(screen.getAllByText("Get 15% Off Entire Order")).toHaveLength(2)
    expect(screen.getByText("Spend $20, Save $5")).toBeVisible()
    expect(screen.getAllByRole("button", { name: "Use Now coupon" })).toHaveLength(1)
    expect(screen.getByText("Expired")).toBeVisible()
    expect(screen.getByText("Used")).toBeVisible()
    expect(list).toHaveBeenCalledTimes(1)
  })

  it("renders distinct and empty Coupon responses without page-local fallback values", async () => {
    const list = vi.spyOn(couponsApi, "list")
    list.mockResolvedValueOnce([{
      id: "custom-coupon",
      title: "Custom API Offer",
      description: "Custom API Meta",
      expiresAt: "2032-02-14",
      state: "available",
      badgeTop: "42%",
      badgeBottom: "SAVE",
      actionLabel: "Use",
      usedDescription: "Used",
    }])
    window.location.hash = "#/coupons"
    render(<FigmaApp />)

    expect(await screen.findByText("Custom API Offer")).toBeVisible()
    expect(screen.getByText("Custom API Meta")).toBeVisible()
    expect(screen.getByRole("button", { name: "Use coupon" })).toHaveTextContent("Use")
    expect(screen.queryByText("Get 15% Off Entire Order")).not.toBeInTheDocument()

    cleanup()
    list.mockResolvedValueOnce([])
    window.location.hash = "#/coupons"
    render(<FigmaApp />)
    expect(await screen.findByRole("heading", { name: "Coupon" })).toBeVisible()
    expect(screen.queryAllByTestId("coupon-row")).toHaveLength(0)
  })

  it("opens and closes the latest Coupon Detail frame", async () => {
    const user = userEvent.setup()
    window.location.hash = "#/coupons"
    render(<FigmaApp />)

    await user.click(await screen.findByRole("button", { name: "View Spend $20, Save $5" }))
    expect(await screen.findByRole("heading", { name: "Coupon Detail" })).toBeVisible()
    expect(document.querySelector('[data-figma-node="66:2870"]')).toBeInTheDocument()
    expect(screen.getByLabelText("Coupon QR code")).toBeVisible()
    expect(screen.getByTestId("coupon-detail-qr")).toHaveAttribute("src", expect.stringContaining("coupon-detail-qr.svg"))
    await user.click(screen.getByRole("button", { name: "Close coupon detail" }))
    expect(await screen.findByRole("heading", { name: "Coupon" })).toBeVisible()
  })

  it("opens Coupon Detail when the Profile coupon action is used", async () => {
    const user = userEvent.setup()
    window.location.hash = "#/coupons"
    render(<FigmaApp />)

    await user.click(await screen.findByRole("button", { name: "Use Now coupon" }))
    expect(await screen.findByRole("heading", { name: "Coupon Detail" })).toBeVisible()
  })

  it("returns Coupon Detail to the route that opened it", async () => {
    const user = userEvent.setup()
    window.location.hash = "#/rewards"
    render(<FigmaApp />)

    await user.click(await screen.findByRole("tab", { name: "Coupon" }))
    await user.click(screen.getByRole("button", { name: "Claim Spend $20, Save $5" }))
    await user.click(screen.getByRole("button", { name: "Use Now Spend $20, Save $5" }))
    expect(await screen.findByRole("heading", { name: "Coupon Detail" })).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Close coupon detail" }))
    expect(await screen.findByRole("tab", { name: "Rewards" })).toBeVisible()
    expect(window.location.hash).toBe("#/rewards")
  })

  it("validates Information on submit and continues straight to instant success", async () => {
    const updateProfile = vi.spyOn(memberApi, "updateProfile")
    const user = userEvent.setup()
    window.location.hash = "#/information/1"
    render(<FigmaApp />)

    expect(await screen.findByRole("heading", { name: "Information" })).toBeVisible()
    expect(document.querySelector('[data-figma-node="42:1110"]')).toBeInTheDocument()
    expect(screen.getByLabelText("Phone")).toHaveValue("(408) 888-1234")
    expect(screen.getByTestId("phone-icon")).toHaveAttribute("alt", "Phone")
    expect(screen.getByTestId("phone-icon")).toHaveAttribute("src", phoneAsset)
    expect(screen.getByLabelText("First name")).toHaveValue("John")
    expect(screen.getByLabelText("Last name")).toHaveValue("H")
    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled()

    const birthday = screen.getByLabelText("Date of birth")
    expect(birthday).toHaveAttribute("type", "month")
    fireEvent.change(birthday, { target: { value: "1993-07" } })
    await user.type(screen.getByLabelText("Email"), "john.h@mail.com")
    await user.click(screen.getByRole("button", { name: "Submit" }))

    expect(updateProfile).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "H",
      birthday: "July 1993",
      email: "john.h@mail.com",
    })
    expect(await screen.findByText("Your visit has been added to your rewards account.")).toBeVisible()
    expect(window.location.hash).toBe("#/success/instant")
  })

  it("shows the clear action only while its populated field is focused and uses the native month picker", async () => {
    const user = userEvent.setup()
    window.location.hash = "#/information/1"
    render(<FigmaApp />)

    const firstName = await screen.findByLabelText("First name")
    await user.click(screen.getByLabelText("Last name"))
    expect(screen.queryByRole("button", { name: "Clear first name" })).not.toBeInTheDocument()
    await user.click(firstName)
    expect(screen.getByRole("button", { name: "Clear first name" })).toBeVisible()

    const birthday = screen.getByLabelText("Date of birth")
    expect(birthday).toHaveAttribute("type", "month")
    expect(birthday).toHaveAttribute("lang", "en-US")
    expect(screen.queryByRole("button", { name: "Choose date of birth" })).not.toBeInTheDocument()
    fireEvent.change(birthday, { target: { value: "2026-07" } })
    expect(birthday).toHaveValue("2026-07")
  })

  it("preserves the localized month label when the native picker is used", async () => {
    const updateProfile = vi.spyOn(memberApi, "updateProfile")
    const user = userEvent.setup()
    await memberApi.setLanguage("zh")
    render(<Information draft={{ firstName: "John", lastName: "H", birthday: "1993年7月", email: "", marketing: false }} onBack={() => {}} onSaved={() => {}} step="1" />)

    const birthday = await screen.findByLabelText("Date of birth")
    expect(birthday).toHaveAttribute("lang", "zh-CN")
    expect(birthday).toHaveValue("1993-07")
    await user.click(screen.getByRole("button", { name: "Submit" }))

    expect(updateProfile).toHaveBeenCalledWith(expect.objectContaining({ birthday: "1993年7月" }))
  })

  it("uses the Figma geometry and only local clean-room assets", () => {
    expect(detailsCss).toMatch(/\.detail-header-clean\s*\{[\s\S]*?position:\s*sticky;[\s\S]*?top:\s*0;[\s\S]*?height:\s*64px;[\s\S]*?background:\s*#fff/)
    expect(detailsCss).toMatch(/\.detail-content-clean\s*\{[\s\S]*?top:\s*92px;[\s\S]*?right:\s*var\(--gb-inline\);[\s\S]*?width:\s*auto/)
    expect(detailsCss).toMatch(/\.information-submit-clean\s*\{[\s\S]*?height:\s*48px;[\s\S]*?border-radius:\s*9999px/)
    expect(detailsCss).toMatch(/\.account-member-copy-clean p\s*\{[\s\S]*?font-size:\s*24px;[\s\S]*?line-height:\s*28\.8px/)
    expect(detailsCss).toMatch(/\.point-status-clean\s*\{[\s\S]*?background:\s*#fef2f2;[\s\S]*?color:\s*#dc2626/)
    expect(detailsCss).toMatch(/\.points-clean\s*\{[\s\S]*?overflow-y:\s*auto;[\s\S]*?scrollbar-width:\s*none/)
    expect(detailsCss).toMatch(/\.points-clean::-webkit-scrollbar\s*\{[\s\S]*?display:\s*none/)
    expect(detailsCss).toMatch(/\.coupon-detail-row-clean:first-child\s*\{\s*height:\s*258px/)
    expect(detailsCss).toMatch(/\.coupon-detail-hero-clean\s*\{\s*width:\s*100%;\s*height:\s*128px/)
    expect(detailsCss).toMatch(/\[data-figma-node="42:1466"\][\s\S]*?\.information-input-shell-clean:focus-within\s*\{[\s\S]*?border:\s*1px solid #d1d1d1;[\s\S]*?box-shadow:\s*0 1px 2px/)
    expect(phoneSvg).toContain("M5.5 2.66667")
    expect(calendarSvg).toContain("M4.83333 4V1.33333")
    expect(detailsCss).not.toMatch(/lucide|features\/profile|styles\/profile-figma/)
  })
})
