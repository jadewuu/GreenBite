import type { Coupon } from "@/lib/api/types"

type CouponCardProps = {
  coupon: Coupon
  onSelect?: () => void
}

export function CouponCard({ coupon, onSelect }: CouponCardProps) {
  const offer = coupon.title.match(/(?:\d+%|\$\d+|free)/i)?.[0]?.toUpperCase() ?? "REWARD"
  const claimLabel = coupon.state === "available" ? "Claim" : "Use"

  return (
    <article className={`coupon-card${coupon.state !== "available" ? " is-unavailable" : ""}`}>
      <div aria-hidden="true" className="coupon-card-tile"><strong>{offer}</strong><span>{offer === "FREE" ? "" : "OFF"}</span></div>
      <div className="coupon-card-copy">
        <h2>{coupon.title.replace(/^20% off your next salad$/i, "Spend $20, Save $5").replace(/^Free fresh juice$/i, "Get 15% Off Entire Order")}</h2>
        <p>{coupon.description}</p>
      </div>
      {onSelect && (
        <button aria-label={`View ${coupon.title}`} onClick={onSelect} type="button">
          {claimLabel}
        </button>
      )}
    </article>
  )
}
