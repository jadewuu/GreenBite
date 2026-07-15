import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { PointsPage } from "./points-page"

afterEach(cleanup)

describe("PointsPage", () => {
  it("groups points activity by month", async () => {
    render(<PointsPage />)

    expect(await screen.findByText("July 2026")).toBeVisible()
    expect(screen.getByText("June 2026")).toBeVisible()
  })
})
