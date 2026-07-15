import { describe, expect, it } from "vitest"
import { rewardsApi } from "./rewards-api"

describe("rewardsApi", () => {
  it("returns the member points balance", async () => {
    const overview = await rewardsApi.getOverview()

    expect(overview.points).toBe(1230)
  })
})
