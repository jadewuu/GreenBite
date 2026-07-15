import { useEffect, useState } from "react"
import { ChevronRight, CircleUserRound, QrCode } from "lucide-react"

import { couponsApi } from "@/lib/api/coupons-api"
import { memberApi } from "@/lib/api/member-api"
import { rewardsApi } from "@/lib/api/rewards-api"
import type { Coupon, Member, RewardsOverview } from "@/lib/api/types"

import { CouponCard } from "./coupon-card"
import { MemberCodePage } from "./member-code-page"
import { RewardTabs } from "./reward-tabs"

type RewardsPageProps = {
  onOpenAccount?: () => void
  onOpenCoupons?: () => void
  onOpenMemberCode?: () => void
  onOpenPoints?: () => void
}

export function RewardsPage({ onOpenAccount, onOpenCoupons, onOpenMemberCode, onOpenPoints }: RewardsPageProps) {
  const [member, setMember] = useState<Member | null>(null)
  const [overview, setOverview] = useState<RewardsOverview | null>(null)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [tab, setTab] = useState<"rewards" | "coupons">("rewards")
  const [showMemberCode, setShowMemberCode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    void Promise.all([memberApi.getCurrent(), rewardsApi.getOverview(), couponsApi.list()]).then(([nextMember, nextOverview, nextCoupons]) => {
      setMember(nextMember)
      setOverview(nextOverview)
      setCoupons(nextCoupons)
    })
  }, [])

  async function showEmptyRewards() {
    setOverview(await rewardsApi.setRewardsState("empty"))
  }

  if (showMemberCode) {
    return <MemberCodePage onClose={() => setShowMemberCode(false)} />
  }

  if (!member || !overview) {
    return <main className="rewards-screen rewards-home" aria-busy="true" />
  }

  if (overview.state === "empty") {
    return (
      <main className="rewards-screen rewards-empty-state">
        <header className="rewards-header">
          <h1>Rewards &amp; Coupon</h1>
          <button aria-label="Open account" onClick={onOpenAccount} type="button"><CircleUserRound aria-hidden="true" size={24} /></button>
        </header>
        <section>
          <div className="empty-reward-mark">✦</div>
          <h2>No Rewards &amp; Coupon</h2>
          <p>New rewards and coupons will appear here when they are available.</p>
          <button className="empty-rewards-return" onClick={() => void rewardsApi.setRewardsState("available").then(setOverview)} type="button">Show rewards</button>
        </section>
      </main>
    )
  }

  const openMemberCode = onOpenMemberCode ?? (() => setShowMemberCode(true))

  return (
    <main className={`rewards-screen rewards-home ${isScrolled ? "rewards-home-scrolled" : ""}`}>
      <header className="rewards-header">
        <h1>Rewards &amp; Coupon</h1>
        <button aria-label="Open account" onClick={onOpenAccount} type="button"><CircleUserRound aria-hidden="true" size={24} /></button>
      </header>

      <section className="member-summary" aria-label="Member rewards summary">
        <p>WELCOME BACK</p>
        <h2>{member.firstName}</h2>
        <button aria-label="Show Member Code" className="member-code-entry" onClick={openMemberCode} type="button">
          <QrCode aria-hidden="true" size={20} />
          <span>Member ID · {member.memberId}</span>
          <ChevronRight aria-hidden="true" size={18} />
        </button>
        <button className="points-link" onClick={onOpenPoints} type="button">
          <strong>{overview.points.toLocaleString("en-US")}</strong>
          <span>points</span>
          <ChevronRight aria-hidden="true" size={18} />
        </button>
      </section>

      <RewardTabs activeTab={tab} onChange={setTab} />
      <div className="rewards-list" onScroll={(event) => setIsScrolled(event.currentTarget.scrollTop > 0)}>
        {tab === "rewards" ? (
          <section className="rewards-list-intro">
            <p className="coupon-eyebrow">YOUR MEMBERSHIP</p>
            <h2>Earn more with every fresh bite.</h2>
            <p>Enjoy rewards, member-only offers, and points on every GreenBite visit.</p>
            <button aria-label="Show empty rewards" className="empty-state-trigger" onClick={() => void showEmptyRewards()} type="button">Show empty rewards</button>
          </section>
        ) : (
          <>
            <section className="coupon-list" aria-label="Available coupons">
              {coupons.map((coupon) => <CouponCard coupon={coupon} key={coupon.id} onSelect={onOpenCoupons} />)}
            </section>
            <button aria-label="Show empty rewards" className="empty-state-trigger" onClick={() => void showEmptyRewards()} type="button">Show empty rewards</button>
          </>
        )}
      </div>
    </main>
  )
}
