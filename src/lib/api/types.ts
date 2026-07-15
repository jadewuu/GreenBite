export type Member = {
  firstName: string
  lastName: string
  memberId: string
  points: number
  joinedAt: string
  language: "en" | "es" | "zh"
  birthday: string
  email: string
}

export type Coupon = {
  id: string
  title: string
  description: string
  expiresAt: string
  state: "available" | "used" | "expired"
}

export type PointActivity = {
  id: string
  date: string
  merchant: string
  points: number
  kind: "earned" | "redeemed"
}

export type ProfileInput = Pick<Member, "firstName" | "lastName" | "birthday" | "email">

export type RewardsState = "available" | "empty"

export type RewardsOverview = {
  points: number
  state: RewardsState
}
