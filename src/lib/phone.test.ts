import { describe, expect, it } from "vitest"
import { digitsOnly, formatUsPhoneNumber, isUsPhoneNumber } from "./phone"

describe("phone helpers", () => {
  it("keeps ten digits", () => expect(digitsOnly("(408) 888-12345")).toBe("4088881234"))
  it("requires ten digits", () => {
    expect(isUsPhoneNumber("4088881234")).toBe(true)
    expect(isUsPhoneNumber("408888123")).toBe(false)
  })
  it("formats a US number", () => expect(formatUsPhoneNumber("4088881234")).toBe("(408) 888-1234"))
})
