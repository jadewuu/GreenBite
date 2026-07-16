import { useEffect, useState } from "react"

import chevron from "@/assets/figma-clean/rewards/chevron.svg"
import couponFoodHeader from "@/assets/figma-clean/rewards/coupon-food-header.png"
import giftIcon from "@/assets/figma-clean/rewards/how-gift.svg"
import gemIcon from "@/assets/figma-clean/rewards/how-gem.svg"
import starIcon from "@/assets/figma-clean/rewards/how-star.svg"
import qrIcon from "@/assets/figma-clean/rewards/qr-icon.svg"
import bubbleTea from "@/assets/figma-clean/rewards/reward-bubble-tea.png"
import brandMark from "@/assets/figma-clean/rewards/rewards-brand.svg"
import panelEmblem from "@/assets/figma-clean/rewards/rewards-emblem.svg"
import brandWordmark from "@/assets/figma-clean/rewards/rewards-mark.svg"
import userIcon from "@/assets/figma-clean/rewards/user.svg"
import { couponsApi } from "@/lib/api/coupons-api"
import { memberApi } from "@/lib/api/member-api"
import { rewardsApi } from "@/lib/api/rewards-api"
import type { Coupon, Member, RewardCatalogItem, RewardsOverview } from "@/lib/api/types"

type RewardsProps = {
  onOpenAccount: () => void
  onOpenMemberCode: () => void
  onOpenPoints: () => void
}

type RewardTab = "Rewards" | "Coupon"

export function Rewards({ onOpenAccount, onOpenMemberCode, onOpenPoints }: RewardsProps) {
  const [member, setMember] = useState<Member | null>(null)
  const [overview, setOverview] = useState<RewardsOverview | null>(null)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [catalog, setCatalog] = useState<RewardCatalogItem[]>([])
  const [activeTab, setActiveTab] = useState<RewardTab>("Rewards")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    void Promise.all([
      memberApi.getCurrent(),
      rewardsApi.getOverview(),
      couponsApi.listRewards(),
      rewardsApi.getCatalog(),
    ]).then(([nextMember, nextOverview, nextCoupons, nextCatalog]) => {
      setMember(nextMember)
      setOverview(nextOverview)
      setCoupons(nextCoupons)
      setCatalog(nextCatalog)
    })
  }, [])

  if (!member || !overview) return <main aria-busy="true" className="figma-frame rewards-frame" />

  return (
    <main className={`figma-frame rewards-frame${scrolled ? " rewards-scrolled" : ""}`} data-figma-node={scrolled ? "37:7193" : activeTab === "Coupon" ? "73:1507" : "69:1047"} data-testid="rewards-scroll-surface" onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 8)}>
      <div className="rewards-layout">
        <RewardsHeader onOpenAccount={onOpenAccount} />
        {!scrolled && <MemberSummary member={member} onOpenMemberCode={onOpenMemberCode} onOpenPoints={onOpenPoints} points={overview.points} />}
        {!scrolled && <HowItWorks compact={activeTab === "Coupon"} />}
        <section className="rewards-catalog" aria-label="Rewards and coupon">
          <RewardTabs active={activeTab} onChange={setActiveTab} />
          {activeTab === "Rewards" ? <RewardItems catalog={catalog} /> : <CouponCards coupons={coupons} />}
        </section>
      </div>
    </main>
  )
}

function RewardsHeader({ onOpenAccount }: { onOpenAccount: () => void }) {
  return <header className="rewards-header"><div aria-label="GreenBite" className="rewards-brand"><img alt="" src={brandMark} /><img alt="GreenBite" src={brandWordmark} /></div><button aria-label="Open account" className="rewards-account-button" onClick={onOpenAccount} type="button"><img alt="" src={userIcon} /></button></header>
}

function MemberSummary({ member, onOpenMemberCode, onOpenPoints, points }: { member: Member; onOpenMemberCode: () => void; onOpenPoints: () => void; points: number }) {
  return <section aria-label="Member rewards summary" className="member-summary-clean"><div className="member-code-inset"><button aria-label="Show Member Code" className="member-code-entry-clean" onClick={onOpenMemberCode} type="button"><span>Show Member Code</span><img alt="" src={qrIcon} /></button></div><div className="member-panel-clean"><img alt="" className="member-panel-emblem" src={panelEmblem} /><p className="member-name">{member.firstName} {member.lastName.charAt(0)}.</p><div className="member-meta"><div><span>Member ID</span><strong>{member.memberId}</strong></div><button aria-label={`${points.toLocaleString("en-US")} points`} onClick={onOpenPoints} type="button"><span>Points <img alt="" src={chevron} /></span><strong>{points.toLocaleString("en-US")}</strong></button></div></div></section>
}

function HowItWorks({ compact }: { compact: boolean }) {
  const items = [
    [starIcon, "Earn points every visit", "1 points for every $1 you spend."],
    [gemIcon, "Reward for new register", "Earn 100 points for new user"],
    [giftIcon, "Unlock free rewards", "Redeem points for free and drinks"],
  ]
  return <section className={`how-it-works${compact ? " is-compact" : ""}`}><h1>How it works</h1>{items.slice(0, compact ? 1 : 3).map(([icon, title, copy]) => <div className="how-it-works-row" key={title}><span aria-hidden="true" className="how-it-works-icon"><img alt="" src={icon} /></span><div><strong>{title}</strong><p>{copy}</p></div></div>)}</section>
}

function RewardTabs({ active, onChange }: { active: RewardTab; onChange: (tab: RewardTab) => void }) {
  return <div className="reward-tabs-clean" role="tablist"><button aria-selected={active === "Rewards"} className={active === "Rewards" ? "is-active" : ""} onClick={() => onChange("Rewards")} role="tab" type="button">Rewards</button><button aria-selected={active === "Coupon"} className={active === "Coupon" ? "is-active" : ""} onClick={() => onChange("Coupon")} role="tab" type="button">Coupon</button></div>
}

function RewardItems({ catalog }: { catalog: RewardCatalogItem[] }) {
  return <div aria-label="Rewards" className="reward-items">{catalog.map((item) => <article className="reward-row-clean" key={item.id}><img alt="" className="reward-thumb-clean" src={bubbleTea} /><div className="reward-copy-clean"><p>{item.title}</p><div><span>{item.points} Points</span><span className={item.priceStruck ? "is-struck" : ""}>{item.price}</span></div></div></article>)}</div>
}

function CouponCards({ coupons }: { coupons: Coupon[] }) {
  return <div aria-label="Coupons" className="coupon-cards">{coupons.slice(0, 3).map((coupon) => <article className="coupon-card-clean" key={coupon.id}><img alt="" className="coupon-card-image" src={couponFoodHeader} /><div className="coupon-card-copy"><p>{coupon.title}</p><span>{coupon.description.replace("Save $5 on orders of $20 or more.", "Expired on July 12, 04:30 PM")}</span><button aria-label={`${coupon.actionLabel} ${coupon.title}`} type="button">{coupon.actionLabel}</button></div></article>)}</div>
}
