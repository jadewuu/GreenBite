import { useEffect, useState } from "react"

import closeIcon from "@/assets/figma-clean/rewards/close.svg"
import couponFood from "@/assets/figma-clean/details/coupon-food.png"
import couponDetailQr from "@/assets/figma-clean/details/coupon-detail-qr.svg"
import { couponsApi } from "@/lib/api/coupons-api"
import type { Coupon } from "@/lib/api/types"

const rule = "Coupon usage has ended as of July 12 at 4:30 PM. Please check back for future offers!"

export function CouponDetail({ couponId, onClose }: { couponId: string; onClose: () => void }) {
  const [coupon, setCoupon] = useState<Coupon | null>(null)

  useEffect(() => { void couponsApi.getById(couponId).then((next) => setCoupon(next ?? null)) }, [couponId])

  if (!coupon) return <main aria-busy="true" className="figma-frame detail-frame-clean" />

  return (
    <main className="figma-frame detail-frame-clean coupon-detail-clean" data-figma-node="66:2870">
      <header className="coupon-detail-header-clean">
        <button aria-label="Close coupon detail" onClick={onClose} type="button"><img alt="" src={closeIcon} /></button>
        <h1>Coupon Detail</h1><span aria-hidden="true" />
      </header>
      <section className="coupon-detail-page-content-clean">
        <div className="coupon-detail-hero-clean"><img alt="" src={couponFood} /></div>
        <div aria-label="Coupon QR code" className="coupon-qr-clean"><img alt="" data-testid="coupon-detail-qr" src={couponDetailQr} /></div>
        <h2>{coupon.title}</h2>
        <p className="coupon-detail-expiry-clean">{coupon.description}</p>
        <hr />
        <h3>Rule</h3>
        <p className="coupon-detail-rule-clean">{Array.from({ length: 9 }, () => rule).join("")}</p>
      </section>
    </main>
  )
}
