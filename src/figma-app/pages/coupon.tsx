import { useEffect, useState } from "react"

import couponArrow from "@/assets/figma-clean/details/coupon-arrow-left.svg"
import couponFood from "@/assets/figma-clean/details/coupon-food.png"
import { couponsApi } from "@/lib/api/coupons-api"
import type { Coupon as CouponData } from "@/lib/api/types"

import { DetailHeader } from "./detail-header"

export function Coupon({ onBack, onOpenCoupon }: { onBack: () => void; onOpenCoupon: (id: string) => void }) {
  const [coupons, setCoupons] = useState<CouponData[] | null>(null)

  useEffect(() => {
    let active = true
    void couponsApi.list().then((nextCoupons) => {
      if (active) setCoupons(nextCoupons)
    })
    return () => { active = false }
  }, [])

  if (!coupons) return <main aria-busy="true" className="figma-frame detail-frame-clean" />

  return (
    <main className="figma-frame detail-frame-clean coupon-clean" data-figma-node="42:3211">
      <DetailHeader arrow={couponArrow} onBack={onBack} title="Coupon" />
      <section aria-label="Coupons" className="coupon-list-clean">
        {coupons.slice(0, 5).map((coupon) => {
          return <CouponRow coupon={coupon} key={coupon.id} onOpen={() => onOpenCoupon(coupon.id)} state={coupon.state} />
        })}
      </section>
    </main>
  )
}

function CouponRow({ coupon, onOpen, state }: { coupon: CouponData; onOpen: () => void; state: CouponData["state"] }) {
  return (
    <article className={`coupon-detail-row-clean${state === "available" ? "" : " is-muted"}`} data-testid="coupon-row">
      <button aria-label={`View ${coupon.title}`} className="coupon-detail-open-clean" onClick={onOpen} type="button">
        <img alt="" src={couponFood} />
      </button>
      <div className="coupon-detail-copy-clean">
        <p>{coupon.title}</p>
        <span>{state === "used" ? coupon.usedDescription : coupon.description}</span>
        {state === "available" && <button aria-label={`${coupon.actionLabel} coupon`} onClick={onOpen} type="button">{coupon.actionLabel}</button>}
      </div>
    </article>
  )
}
