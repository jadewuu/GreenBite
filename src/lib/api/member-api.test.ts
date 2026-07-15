import { describe, expect, it } from "vitest"
import { memberApi } from "./member-api"

describe("memberApi", () => {
  it("updates the local member profile", async () => {
    const updated = await memberApi.updateProfile({
      firstName: "John",
      lastName: "H.",
      birthday: "1990-01-01",
      email: "john@example.com",
    })

    expect(updated.firstName).toBe("John")
    expect(updated.email).toBe("john@example.com")
  })
})
