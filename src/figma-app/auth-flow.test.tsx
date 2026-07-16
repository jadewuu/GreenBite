import { readFileSync } from "node:fs"

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FigmaApp } from "./app"

const authCss = readFileSync("src/figma-app/styles/auth.css", "utf8")
const tokensCss = readFileSync("src/figma-app/styles/tokens.css", "utf8")

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

beforeEach(() => {
  window.location.hash = ""
})

describe("Figma clean-room authentication flow", () => {
  it("moves from the landing frame through phone verification to information completion", async () => {
    const user = userEvent.setup()
    render(<FigmaApp />)

    expect(document.querySelector('[data-figma-node="5:625"]')).toBeInTheDocument()
    expect(screen.queryByText("Take less than 30 seconds")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Join Rewards" }))
    expect(document.querySelector('[data-figma-node="47:836"]')).toBeInTheDocument()

    const phone = screen.getByLabelText("Phone number")
    await user.type(phone, "4088881234")
    expect(phone).toHaveValue("(408) 888-1234")
    await user.click(screen.getByRole("button", { name: "Continue" }))

    expect(document.querySelector('[data-figma-node="5:2678"]')).toBeInTheDocument()
    expect(screen.getByText(/sent to \(408\) 888-1234/)).toBeVisible()
    await user.type(screen.getAllByLabelText("Verification digit")[0], "123456")

    expect(await screen.findByRole("heading", { name: "Information" })).toBeVisible()
    expect(window.location.hash).toBe("#/information/1")
  })

  it("restores the formatted phone number when returning from verification", async () => {
    const user = userEvent.setup()
    render(<FigmaApp />)

    await user.click(screen.getByRole("button", { name: "Join Rewards" }))
    await user.type(screen.getByLabelText("Phone number"), "4088881234")
    await user.click(screen.getByRole("button", { name: "Continue" }))
    await user.click(screen.getByRole("button", { name: "Go back" }))

    expect(screen.getByLabelText("Phone number")).toHaveValue("(408) 888-1234")
  })

  it("keeps the locked viewport height while routing from phone to verification and information", async () => {
    const previousHeight = window.innerHeight
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 874 })
    const user = userEvent.setup()
    window.location.hash = "#/login"
    render(<FigmaApp />)

    window.dispatchEvent(new Event("orientationchange"))
    expect(document.documentElement.style.getPropertyValue("--gb-locked-viewport-height")).toBe("874px")
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 520 })
    await user.type(screen.getByLabelText("Phone number"), "4088881234")
    await user.click(screen.getByRole("button", { name: "Continue" }))
    expect(document.documentElement.style.getPropertyValue("--gb-locked-viewport-height")).toBe("874px")
    await user.type(screen.getAllByLabelText("Verification digit")[0], "123456")
    expect(await screen.findByRole("heading", { name: "Information" })).toBeVisible()
    expect(document.documentElement.style.getPropertyValue("--gb-locked-viewport-height")).toBe("874px")

    Object.defineProperty(window, "innerHeight", { configurable: true, value: previousHeight })
  })

  it("only enables Continue for ten valid digits", async () => {
    const user = userEvent.setup()
    render(<FigmaApp />)

    await user.click(screen.getByRole("button", { name: "Join Rewards" }))
    const continueButton = screen.getByRole("button", { name: "Continue" })
    expect(continueButton).toBeDisabled()

    await user.type(screen.getByLabelText("Phone number"), "408888123")
    expect(continueButton).toBeDisabled()
    await user.type(screen.getByLabelText("Phone number"), "4")
    expect(continueButton).toBeEnabled()
  })

  it("clears a completed invalid OTP and accepts 123456", async () => {
    const user = userEvent.setup()
    render(<FigmaApp />)

    await user.click(screen.getByRole("button", { name: "Join Rewards" }))
    await user.type(screen.getByLabelText("Phone number"), "4088881234")
    await user.click(screen.getByRole("button", { name: "Continue" }))
    const otp = screen.getAllByLabelText("Verification digit")
    await user.type(otp[0], "000000")

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid verification code. Try 123456.")
    otp.forEach((input) => expect(input).toHaveValue(""))

    await user.type(otp[0], "123456")
    expect(await screen.findByRole("heading", { name: "Information" })).toBeVisible()
  })

  it("clears verification state and confirms a resend", () => {
    vi.useFakeTimers()
    render(<FigmaApp />)

    fireEvent.click(screen.getByRole("button", { name: "Join Rewards" }))
    fireEvent.change(screen.getByLabelText("Phone number"), { target: { value: "4088881234" } })
    fireEvent.click(screen.getByRole("button", { name: "Continue" }))
    fireEvent.change(screen.getAllByLabelText("Verification digit")[0], { target: { value: "1" } })

    act(() => vi.advanceTimersByTime(31_000))
    fireEvent.click(screen.getByRole("button", { name: "Resend code" }))

    expect(screen.getAllByLabelText("Verification digit")[0]).toHaveValue("")
    expect(screen.getByRole("button", { name: "Resend in 31s" })).toBeDisabled()
    expect(screen.getByRole("status")).toHaveTextContent("Verification code resent.")
  })

  it("routes Check Details to the future points screen", async () => {
    window.location.hash = "#/success"
    const user = userEvent.setup()
    render(<FigmaApp />)

    await user.click(screen.getByRole("button", { name: "Check Details" }))
    expect(window.location.hash).toBe("#/points")
  })

  it("renders the reviewable instant and already-claimed status routes", () => {
    window.location.hash = "#/success/instant"
    const { unmount } = render(<FigmaApp />)

    expect(document.querySelector('[data-figma-node="64:1591"]')).toBeInTheDocument()
    expect(screen.getByText("Your visit has been added to your rewards account.")).toBeVisible()
    unmount()

    window.location.hash = "#/failed"
    render(<FigmaApp />)
    expect(document.querySelector('[data-figma-node="42:3899"]')).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Already Claimed" })).toBeVisible()
    expect(screen.getByRole("link", { name: "Support@mail.com" })).toHaveAttribute("href", "mailto:Support@mail.com")
  })

  it("uses local fonts and fluid layout without scaling interactive controls", () => {
    expect(tokensCss).toContain("satoshi-regular.woff2")
    expect(tokensCss).toContain("satoshi-medium.woff2")
    expect(tokensCss).toContain("satoshi-bold.woff2")
    expect(tokensCss).not.toMatch(/@import\s+url/)
    expect(tokensCss).not.toMatch(/transform:\s*scale/)
    expect(authCss).toMatch(/\.auth-back\s*\{[\s\S]*?min-width:\s*44px/)
    expect(authCss).toMatch(/\.resend-button\s*\{[\s\S]*?min-height:\s*44px/)
    expect(authCss).toMatch(/\.auth-frame\s*\{[\s\S]*?height:\s*var\(--gb-locked-viewport-height,\s*100vh\)/)
    expect(authCss).toMatch(/\.auth-frame\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?top:\s*0;[\s\S]*?width:\s*min\(100%,\s*768px\)/)
    expect(authCss).toMatch(/\.auth-entry-stack\s*\{[\s\S]*?padding:\s*20px/)
    expect(authCss).toMatch(/\.landing-benefits\s*\{[\s\S]*?padding:\s*8px\s+0/)
    expect(tokensCss).toMatch(/\.figma-app\s*\{[\s\S]*?width:\s*min\(100%,\s*768px\)/)
    expect(tokensCss).toMatch(/overscroll-behavior-y:\s*none/)
  })
})
