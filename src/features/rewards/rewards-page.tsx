import { useEffect, useState } from "react"

import { couponsApi } from "@/lib/api/coupons-api"
import { memberApi } from "@/lib/api/member-api"
import { rewardsApi } from "@/lib/api/rewards-api"
import type { Coupon, Member, PointActivity, RewardsOverview } from "@/lib/api/types"

import { CouponCard } from "./coupon-card"
import { MemberCodePage } from "./member-code-page"
import { RewardTabs } from "./reward-tabs"
import "@/styles/rewards-figma.css"
import logoMark from "@/assets/figma/rewards-logo-mark.svg"
import logoWordmark from "@/assets/figma/rewards-logo-wordmark.svg"
import profileIcon from "@/assets/figma/rewards-profile.svg"
import qrIcon from "@/assets/figma/rewards-qr.svg"
import panelMark from "@/assets/figma/rewards-panel-mark.svg"
import chevronIcon from "@/assets/figma/rewards-chevron.svg"
import emptyIllustration from "@/assets/figma/rewards-empty.png"

type RewardsPageProps = {
  onOpenAccount?: () => void
  onOpenCoupons?: () => void
  onOpenMemberCode?: () => void
  onOpenPoints?: () => void
}

export function RewardsPage({ onOpenAccount, onOpenCoupons, onOpenMemberCode, onOpenPoints }: RewardsPageProps) {
  const [member, setMember] = useState<Member | null>(null)
  const [overview, setOverview] = useState<RewardsOverview | null>(null)
  const [activities, setActivities] = useState<PointActivity[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [tab, setTab] = useState<"points" | "coupons">("coupons")
  const [showMemberCode, setShowMemberCode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    void Promise.all([memberApi.getCurrent(), rewardsApi.getOverview(), rewardsApi.getActivities(), couponsApi.list()]).then(([nextMember, nextOverview, nextActivities, nextCoupons]) => {
      setMember(nextMember)
      setOverview(nextOverview)
      setActivities(nextActivities)
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
        <RewardsTopbar onOpenAccount={onOpenAccount} />
        <MemberSummary member={member} overview={overview} onMemberCode={onOpenMemberCode ?? (() => setShowMemberCode(true))} onPoints={onOpenPoints} />
        <section className="rewards-empty-content">
          <img alt="" src={emptyIllustration} />
          <h2>No Rewards &amp; Coupon</h2>
          <button aria-label="Show empty rewards" className="empty-state-trigger" onClick={() => void rewardsApi.setRewardsState("available").then(setOverview)} type="button">Show empty rewards</button>
        </section>
      </main>
    )
  }

  const openMemberCode = onOpenMemberCode ?? (() => setShowMemberCode(true))

  return (
    <main className={`rewards-screen rewards-home ${isScrolled ? "rewards-home-scrolled" : ""}`}>
      {!isScrolled && <><RewardsTopbar onOpenAccount={onOpenAccount} /><MemberSummary member={member} overview={overview} onMemberCode={openMemberCode} onPoints={onOpenPoints} /><h1 className="rewards-section-title">Rewards &amp; Coupon</h1></>}
      <RewardTabs activeTab={tab} onChange={setTab} />
      <div className="rewards-list" onScroll={(event) => setIsScrolled(event.currentTarget.scrollTop > 0)}>
        {tab === "points" ? (
          <section className="points-list" aria-label="Points activity">
            {activities.map((activity) => (
              <div className="points-activity" key={activity.id}>
                <div>
                  <h3>{activity.merchant}</h3>
                  <p>{new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${activity.date}T12:00:00`))}</p>
                </div>
                <strong className={activity.kind === "earned" ? "points-earned" : "points-redeemed"}>
                  {activity.points > 0 ? "+" : ""}{activity.points} points
                </strong>
              </div>
            ))}
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

function RewardsTopbar({ onOpenAccount }: Pick<RewardsPageProps, "onOpenAccount">) {
  return (
    <header className="rewards-topbar">
      <div className="rewards-logo" aria-label="GreenBite"><img alt="" src={logoMark} /><img alt="GreenBite" src={logoWordmark} /></div>
      <button aria-label="Open account" onClick={onOpenAccount} type="button"><img alt="" src={profileIcon} /></button>
    </header>
  )
}

function MemberSummary({ member, overview, onMemberCode, onPoints }: { member: Member; overview: RewardsOverview; onMemberCode: () => void; onPoints?: () => void }) {
  return (
    <section className="member-summary" aria-label="Member rewards summary">
      <button aria-label="Show Member Code" className="member-code-entry" onClick={onMemberCode} type="button"><span>Show Member Code</span><img alt="" src={qrIcon} /></button>
      <div className="member-panel">
        <img alt="" className="member-panel-mark" src={panelMark} />
        <div><h2>{member.firstName} {member.lastName.charAt(0)}.</h2><p>Member ID</p><strong>{member.memberId}</strong></div>
        <button aria-label={`${overview.points.toLocaleString("en-US")} points`} className="points-link" onClick={onPoints} type="button"><span>Points <img alt="" src={chevronIcon} /></span><strong>{overview.points.toLocaleString("en-US")}</strong></button>
      </div>
    </section>
  )
}
