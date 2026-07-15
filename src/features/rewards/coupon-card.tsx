import type { Coupon } from "@/lib/api/types"

type CouponCardProps = {
  coupon: Coupon
  onSelect?: () => void
}

export function CouponCard({ coupon, onSelect }: CouponCardProps) {
  const expiry = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${coupon.expiresAt}T12:00:00`))

  return (
    <article className="coupon-card">
      <div>
        <p className="coupon-eyebrow">GREENBITE REWARD</p>
        <h2>{coupon.title}</h2>
        <p className="coupon-description">{coupon.description}</p>
      </div>
      <div className="coupon-footer">
        <span>Expires {expiry}</span>
        <button aria-label={`View ${coupon.title}`} onClick={onSelect} type="button">
          View
        </button>
      </div>
    </article>
  )
}
