import { useEffect, useState } from "react"
import { couponsApi } from "@/lib/api/coupons-api"
import type { Coupon } from "@/lib/api/types"
import { CouponCard } from "./coupon-card"
import "@/styles/rewards-figma.css"
import backIcon from "@/assets/figma/detail-back.svg"

type CouponsPageProps = {
  onBack?: () => void
}

export function CouponsPage({ onBack = () => { window.location.hash = "/rewards" } }: CouponsPageProps) {
  const [coupons, setCoupons] = useState<Coupon[] | null>(null)

  useEffect(() => {
    void couponsApi.list().then(setCoupons)
  }, [])

  if (!coupons) {
    return <main aria-busy="true" className="detail-screen" />
  }

  return (
    <main className="detail-screen coupons-detail-screen">
      <header className="detail-header">
        <button aria-label="Back" onClick={onBack} type="button"><img alt="" src={backIcon} /></button>
        <h1>Coupon</h1>
        <span aria-hidden="true" />
      </header>

      {coupons.length === 0 ? (
        <p className="detail-empty">No coupons are available right now.</p>
      ) : (
        <section className="coupon-detail-list" aria-label="Coupons">
          {coupons.map((coupon) => <CouponCard coupon={coupon} key={coupon.id} />)}
        </section>
      )}
    </main>
  )
}
