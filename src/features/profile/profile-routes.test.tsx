import { act, cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { AppRouter } from "@/router"

describe("profile routes", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "#/account")
  })

  afterEach(cleanup)

  it("saves a language preference while keeping the demo interface in English", async () => {
    const user = userEvent.setup()
    render(<AppRouter />)

    await user.click(await screen.findByRole("button", { name: "Language" }))
    await user.click(screen.getByRole("radio", { name: "Spanish" }))

    expect(screen.getByRole("radio", { name: "Spanish" })).toBeChecked()
    expect(screen.getByRole("heading", { name: "Language" })).toBeVisible()
    expect(screen.getByRole("heading", { name: "Language" }).closest("header")).toHaveClass("figma-detail-header")
    expect(screen.queryByRole("heading", { name: "Idioma" })).not.toBeInTheDocument()
  })

  it("validates and saves a complete member profile", async () => {
    const user = userEvent.setup()
    render(<AppRouter />)

    await user.click(await screen.findByRole("button", { name: "Complete information" }))
    expect(screen.getByRole("heading", { name: "Information" }).closest("header")).toHaveClass("figma-detail-header")
    await user.clear(await screen.findByLabelText("First name"))
    await user.clear(screen.getByLabelText("Last name"))
    await user.clear(screen.getByLabelText("Date of birth"))
    await user.clear(screen.getByLabelText("Email"))
    await user.click(screen.getByRole("button", { name: "Continue" }))
    expect(await screen.findByText("First name is required.")).toBeVisible()

    await user.type(screen.getByLabelText("First name"), "John")
    await user.type(screen.getByLabelText("Last name"), "H.")
    await user.type(screen.getByLabelText("Date of birth"), "1990-01-01")
    await user.type(screen.getByLabelText("Email"), "john@example.com")
    await user.click(screen.getByRole("button", { name: "Continue" }))

    expect(await screen.findByRole("heading", { name: "Confirm information" })).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Save information" }))

    expect(await screen.findByText("john@example.com")).toBeVisible()
  })

  it("does not reopen confirmation after its addressed Back followed by browser Back", async () => {
    const user = userEvent.setup()
    render(<AppRouter />)

    await user.click(await screen.findByRole("button", { name: "Complete information" }))
    await user.click(await screen.findByRole("button", { name: "Continue" }))
    expect(await screen.findByRole("heading", { name: "Confirm information" })).toBeVisible()

    await user.click(screen.getByRole("button", { name: "Back" }))
    expect(await screen.findByRole("heading", { name: "Information" })).toBeVisible()

    const historyNavigation = new Promise<void>((resolve) => {
      const done = () => resolve()
      window.addEventListener("popstate", done, { once: true })
      window.addEventListener("hashchange", done, { once: true })
    })
    await act(async () => {
      window.history.back()
      await historyNavigation
    })

    await waitFor(() => expect(screen.queryByRole("heading", { name: "Confirm information" })).not.toBeInTheDocument())
    expect(screen.getByRole("heading", { name: "Information" })).toBeVisible()
    expect(window.location.hash).toBe("#/information/1")
  })
})
