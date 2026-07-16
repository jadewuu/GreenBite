export type Member = {
  firstName: string
  lastName: string
  memberId: string
  points: number
  joinedAt: string
  language: "en" | "es" | "zh"
  birthday: string
  email: string
  memberCode: string
}

export type Coupon = {
  id: string
  title: string
  description: string
  expiresAt: string
  state: "available" | "used" | "expired"
  badgeTop: string
  badgeBottom: string
  actionLabel: string
  usedDescription: string
}

export type RewardCatalogItem = {
  id: string
  title: string
  points: number
  price: string
  priceStruck?: boolean
}

export type PointActivity = {
  id: string
  date: string
  merchant: string
  points: number
  kind: "earned" | "redeemed"
  monthLabel: string
  displayDate: string
  channel: string
  orderId: string
  label: string
  status?: string
}

export type ProfileInput = Pick<Member, "firstName" | "lastName" | "birthday" | "email">

export type RewardsState = "available" | "empty"

export type RewardsOverview = {
  points: number
  state: RewardsState
}
