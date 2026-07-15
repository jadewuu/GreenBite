import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AppShell } from "./app-shell"

describe("AppShell", () => {
  it("uses the fluid tablet app canvas", () => {
    render(<AppShell><div>content</div></AppShell>)

    expect(screen.getByTestId("app-canvas")).toHaveClass("app-canvas")
  })
})
