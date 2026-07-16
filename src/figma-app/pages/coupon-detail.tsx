import { useEffect, useState } from "react"

import closeIcon from "@/assets/figma-clean/rewards/close.svg"
import couponFood from "@/assets/figma-clean/details/coupon-food.png"
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
        <div aria-label="Coupon QR code" className="coupon-qr-clean"><QrPattern /></div>
        <h2>{coupon.title}</h2>
        <p className="coupon-detail-expiry-clean">{coupon.description}</p>
        <hr />
        <h3>Rule</h3>
        <p className="coupon-detail-rule-clean">{Array.from({ length: 9 }, () => rule).join("")}</p>
      </section>
    </main>
  )
}

function QrPattern() {
  return <svg aria-hidden="true" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
    <rect width="160" height="160" fill="#fff" />
    <g fill="#000">
      <path d="M0 0h56v56H0zm8 8v40h40V8zM16 16h24v24H16zM104 0h56v56h-56zm8 8v40h40V8zm8 8h24v24h-24zM0 104h56v56H0zm8 8v40h40v-40zm8 8h24v24H16z" />
      <path d="M64 0h8v8h16v8h8v16h-8v8h-8v-8h-8v16h8v8h16v8h-8v16H72v-8h-8zm40 64h8v16h8v-8h16v8h8v16h-8v8h16v8h-8v16h16v8h-24v-16h-16v24h-8v-16h-8v8H72v-8h-8v-16h8v-8h16v8h8v-8h8zm-40 8h16v8h8v8H72v8h16v8h-8v8H64zm32 32h8v8h16v8h8v16h-8v8h-16v-8H96zm40-40h8v8h16v16h-8v8h-16v-8h8v-8h-8z" />
    </g>
  </svg>
}
