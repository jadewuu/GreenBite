import type { PointActivity, RewardCatalogItem, RewardsOverview, RewardsState } from "./types"

export interface RewardsApi {
  getOverview(): Promise<RewardsOverview>
  getActivities(): Promise<PointActivity[]>
  setRewardsState(state: RewardsState): Promise<RewardsOverview>
  getCatalog(): Promise<RewardCatalogItem[]>
}

const activities: PointActivity[] = [
  { id: "activity-1", date: "2026-07-16", merchant: "HKC(RH)", points: 28, kind: "earned", monthLabel: "July 2026", displayDate: "Today, 04:30 PM", channel: "HKC(RH)", orderId: "ORD00123456", label: "Purchase", status: "Pending" },
  { id: "activity-2", date: "2026-07-12", merchant: "HKC(RH)", points: -100, kind: "redeemed", monthLabel: "July 2026", displayDate: "July 12, 04:30 PM", channel: "HKC(RH)", orderId: "ORD00123456", label: "Payment" },
  { id: "activity-3", date: "2026-07-02", merchant: "HKC(WH)", points: 100, kind: "earned", monthLabel: "July 2026", displayDate: "July 2, 04:30 PM", channel: "HKC(WH)", orderId: "ORD00123456", label: "Purchase" },
  { id: "activity-4", date: "2026-06-12", merchant: "HKC(RH)", points: 100, kind: "earned", monthLabel: "June 2026", displayDate: "June 12, 04:30 PM", channel: "HKC(RH)", orderId: "ORD00123456", label: "Purchase" },
  { id: "activity-5", date: "2026-06-12", merchant: "HKC(RH)", points: -100, kind: "redeemed", monthLabel: "June 2026", displayDate: "June 12, 04:30 PM", channel: "HKC(RH)", orderId: "ORD00123456", label: "Payment" },
  { id: "activity-6", date: "2026-06-12", merchant: "HKC(WH)", points: 100, kind: "earned", monthLabel: "June 2026", displayDate: "June 12, 04:30 PM", channel: "HKC(WH)", orderId: "ORD00123456", label: "Purchase" },
  { id: "activity-7", date: "2026-06-12", merchant: "HKC(RH)", points: -100, kind: "redeemed", monthLabel: "June 2026", displayDate: "June 12, 04:30 PM", channel: "HKC(RH)", orderId: "ORD00123456", label: "Payment" },
  { id: "activity-8", date: "2026-06-12", merchant: "HKC(WH)", points: 100, kind: "earned", monthLabel: "June 2026", displayDate: "June 12, 04:30 PM", channel: "HKC(WH)", orderId: "ORD00123456", label: "Purchase" },
  { id: "activity-9", date: "2026-06-12", merchant: "HKC(RH)", points: -100, kind: "redeemed", monthLabel: "June 2026", displayDate: "June 12, 04:30 PM", channel: "HKC(RH)", orderId: "ORD00123456", label: "Payment" },
  { id: "activity-10", date: "2026-06-12", merchant: "HKC(WH)", points: 100, kind: "earned", monthLabel: "June 2026", displayDate: "June 12, 04:30 PM", channel: "HKC(WH)", orderId: "ORD00123456", label: "Purchase" },
]

const catalog: RewardCatalogItem[] = [
  { id: "reward-1", title: "Dry-pot Brussels Sprouts", points: 50, price: "$5.00", priceStruck: true },
  { id: "reward-2", title: "Dry-pot Brussels Sprouts", points: 50, price: "$5.00", priceStruck: true },
  { id: "reward-3", title: "Roasted Garlic Mushrooms", points: 40, price: "$4.50" },
  { id: "reward-4", title: "Spicy Buffalo Cauliflower Bites", points: 60, price: "$6.75" },
  { id: "reward-5", title: "Honey Glazed Carrot Sticks", points: 55, price: "$5.50" },
  { id: "reward-6", title: "Garlic Mashed Potatoes", points: 60, price: "$6.00" },
  { id: "reward-7", title: "Roasted Beet Salad with Feta", points: 45, price: "$5.50" },
  { id: "reward-8", title: "Crispy Sesame Tofu", points: 50, price: "$5.00" },
  { id: "reward-9", title: "Miso Glazed Eggplant", points: 55, price: "$5.75" },
  { id: "reward-10", title: "Chili Lime Corn", points: 35, price: "$4.00" },
]

let rewardsState: RewardsState = "available"

const overview = (): RewardsOverview => ({ points: 1230, state: rewardsState })

export const rewardsApi: RewardsApi = {
  async getOverview() {
    return overview()
  },

  async getActivities() {
    return activities.map((activity) => ({ ...activity }))
  },

  async setRewardsState(state) {
    rewardsState = state
    return overview()
  },

  async getCatalog() {
    return catalog.map((item) => ({ ...item }))
  },
}
