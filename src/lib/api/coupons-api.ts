import type { Coupon } from "./types"

export interface CouponsApi {
  list(): Promise<Coupon[]>
  getById(id: string): Promise<Coupon | undefined>
}

const coupons: Coupon[] = [
  { id: "coupon-1", title: "20% off your next salad", description: "Valid on any made-to-order salad.", expiresAt: "2026-07-31", state: "available" },
  { id: "coupon-2", title: "Free fresh juice", description: "Enjoy one fresh juice with a qualifying purchase.", expiresAt: "2026-08-07", state: "available" },
  { id: "coupon-3", title: "$5 off a bowl", description: "Save $5 on a signature grain bowl.", expiresAt: "2026-08-14", state: "available" },
  { id: "coupon-4", title: "Double points Tuesday", description: "Earn double points on Tuesday purchases.", expiresAt: "2026-08-21", state: "expired" },
  { id: "coupon-5", title: "Free topping", description: "Add one premium topping at no cost.", expiresAt: "2026-08-28", state: "used" },
]

const copyCoupon = (coupon: Coupon) => ({ ...coupon })

export const couponsApi: CouponsApi = {
  async list() {
    return coupons.map(copyCoupon)
  },

  async getById(id) {
    const coupon = coupons.find((item) => item.id === id)
    return coupon ? copyCoupon(coupon) : undefined
  },
}
