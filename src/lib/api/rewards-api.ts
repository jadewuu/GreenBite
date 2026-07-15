import type { PointActivity, RewardsOverview, RewardsState } from "./types"

export interface RewardsApi {
  getOverview(): Promise<RewardsOverview>
  getActivities(): Promise<PointActivity[]>
  setRewardsState(state: RewardsState): Promise<RewardsOverview>
}

const activities: PointActivity[] = [
  { id: "activity-1", date: "2026-07-12", merchant: "GreenBite Market", points: 120, kind: "earned" },
  { id: "activity-2", date: "2026-07-04", merchant: "GreenBite Cafe", points: -80, kind: "redeemed" },
  { id: "activity-3", date: "2026-06-21", merchant: "GreenBite Market", points: 90, kind: "earned" },
  { id: "activity-4", date: "2026-06-03", merchant: "GreenBite Cafe", points: 60, kind: "earned" },
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
}
