import { describe, expect, it } from "vitest"
import { couponsApi } from "./coupons-api"

describe("couponsApi", () => {
  it("lists the three current local coupons", async () => {
    const coupons = await couponsApi.list()

    expect(coupons).toHaveLength(3)
  })
})
