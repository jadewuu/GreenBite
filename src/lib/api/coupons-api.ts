import type { Coupon } from "./types"

export interface CouponsApi {
  list(): Promise<Coupon[]>
  listRewards(): Promise<Coupon[]>
  getById(id: string): Promise<Coupon | undefined>
}

const coupons: Coupon[] = [
  { id: "coupon-1", title: "Spend $20, Save $5", description: "Expired on July 12, 04:30 PM", expiresAt: "2026-07-12T16:30:00", state: "available", badgeTop: "$5", badgeBottom: "OFF", actionLabel: "Use Now", usedDescription: "Used" },
  { id: "coupon-2", title: "Get 15% Off Entire Order", description: "Expired", expiresAt: "2026-07-12T16:30:00", state: "expired", badgeTop: "15%", badgeBottom: "OFF", actionLabel: "Use Now", usedDescription: "Used" },
  { id: "coupon-3", title: "Get 15% Off Entire Order", description: "Used", expiresAt: "2026-07-12T16:30:00", state: "used", badgeTop: "15%", badgeBottom: "OFF", actionLabel: "Use Now", usedDescription: "Used" },
]

const rewardsCoupons: Coupon[] = [
  { id: "coupon-1", title: "Spend $20, Save $5", description: "Save $5 on orders of $20 or more.", expiresAt: "2026-07-31", state: "available", badgeTop: "$5", badgeBottom: "OFF", actionLabel: "Claim", usedDescription: "Used" },
  { id: "coupon-2", title: "Get 15% Off Entire Order", description: "Save 15% on one entire order.", expiresAt: "2026-08-07", state: "used", badgeTop: "15%", badgeBottom: "OFF", actionLabel: "Use", usedDescription: "Used" },
  { id: "coupon-3", title: "Free mini bowl on Orders $50+", description: "Receive a free mini bowl on orders over $50.", expiresAt: "2026-08-14", state: "available", badgeTop: "", badgeBottom: "", actionLabel: "Claim", usedDescription: "Used" },
  { id: "coupon-4", title: "Spend $40, Save $10", description: "Save $10 on orders of $40 or more.", expiresAt: "2026-08-21", state: "available", badgeTop: "$10", badgeBottom: "OFF", actionLabel: "Claim", usedDescription: "Used" },
  { id: "coupon-5", title: "Free Drink on Orders $50+", description: "Receive a free drink on orders over $50.", expiresAt: "2026-08-28", state: "available", badgeTop: "Free", badgeBottom: "Drinks", actionLabel: "Claim", usedDescription: "Used" },
]

const copyCoupon = (coupon: Coupon) => ({ ...coupon })

export const couponsApi: CouponsApi = {
  async list() {
    return coupons.map(copyCoupon)
  },

  async listRewards() {
    return rewardsCoupons.map(copyCoupon)
  },

  async getById(id) {
    const coupon = coupons.find((item) => item.id === id)
    return coupon ? copyCoupon(coupon) : undefined
  },
}
