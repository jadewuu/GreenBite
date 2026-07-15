import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"

import { couponsApi } from "@/lib/api/coupons-api"
import type { Coupon } from "@/lib/api/types"

type CouponsPageProps = {
  onBack?: () => void
}

function couponOffer(title: string) {
  const match = title.match(/(?:\d+%|\$\d+|free|double points)/i)
  return match ? match[0].toUpperCase() : "REWARD"
}

function couponStatus(coupon: Coupon) {
  if (coupon.state === "expired") return "Expired"
  if (coupon.state === "used") return "Used"

  return `Expires on ${new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${coupon.expiresAt}T12:00:00`))}`
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
        <button aria-label="Back" onClick={onBack} type="button"><ArrowLeft aria-hidden="true" size={24} /></button>
        <h1>Coupon</h1>
        <span aria-hidden="true" />
      </header>

      {coupons.length === 0 ? (
        <p className="detail-empty">No coupons are available right now.</p>
      ) : (
        <section className="coupon-detail-list" aria-label="Coupons">
          {coupons.map((coupon) => {
            const unavailable = coupon.state !== "available"

            return (
              <article aria-label={coupon.title} className={`coupon-detail-row${unavailable ? " is-unavailable" : ""}`} key={coupon.id}>
                <p className="coupon-detail-offer">{couponOffer(coupon.title)}</p>
                <div>
                  <h2>{coupon.title}</h2>
                  <p>{couponStatus(coupon)}</p>
                </div>
                {coupon.state === "available" && <button type="button">Use</button>}
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}
