import { useEffect, useState } from "react"

import accountArrow from "@/assets/figma-clean/details/account-arrow-left.svg"
import editIcon from "@/assets/figma-clean/details/edit.svg"
import { memberApi } from "@/lib/api/member-api"
import type { Member } from "@/lib/api/types"

import { DetailHeader } from "./detail-header"

function formatMemberSince(joinedAt: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })
    .format(new Date(`${joinedAt}T12:00:00`))
    .replace(", ", ",")
}

type AccountProps = {
  onBack: () => void
  onOpenCoupons: () => void
  onOpenInformation: () => void
  onOpenLanguage: () => void
  onOpenPoints: () => void
  onSignOut: () => void
}

export function Account({ onBack, onOpenCoupons, onOpenInformation, onOpenLanguage, onOpenPoints, onSignOut }: AccountProps) {
  const [member, setMember] = useState<Member | null>(null)

  useEffect(() => {
    let active = true
    void memberApi.getCurrent().then((nextMember) => {
      if (active) setMember(nextMember)
    })
    return () => { active = false }
  }, [])

  if (!member) return <main aria-busy="true" className="figma-frame detail-frame-clean" />

  return (
    <main className="figma-frame detail-frame-clean account-clean" data-figma-node="37:6812">
      <DetailHeader arrow={accountArrow} onBack={onBack} title="Profile" />
      <div className="detail-content-clean account-content-clean">
        <section aria-label="Member profile" className="account-member-clean">
          <div className="account-member-copy-clean">
            <p>{member.firstName} {member.lastName.charAt(0)}.</p>
            <span>Member since {formatMemberSince(member.joinedAt)}</span>
          </div>
          <button aria-label="Complete information" className="account-edit-clean" onClick={onOpenInformation} type="button">
            <img alt="" src={editIcon} />
          </button>
        </section>

        <nav aria-label="Account settings" className="account-menu-clean">
          <AccountRow icon="points" label="Points" onClick={onOpenPoints} />
          <AccountRow icon="coupon" label="Coupon" onClick={onOpenCoupons} />
          <AccountRow icon="language" label="Language" onClick={onOpenLanguage} />
        </nav>
      </div>
      <button className="account-signout-clean" onClick={onSignOut} type="button">Sign Out</button>
    </main>
  )
}

function AccountRow({ icon, label, onClick }: { icon: "coupon" | "language" | "points"; label: string; onClick: () => void }) {
  return (
    <button aria-label={label} className="account-row-clean" onClick={onClick} type="button">
      <span aria-hidden="true" className={`account-menu-icon-clean is-${icon}`} />
      <span>{label}</span>
      <span aria-hidden="true" className="account-chevron-clean" />
    </button>
  )
}
