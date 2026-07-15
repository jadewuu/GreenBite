import { useEffect, useState } from "react"
import { ChevronRight, CircleDollarSign, Globe2, Pencil, TicketPercent } from "lucide-react"

import { memberApi } from "@/lib/api/member-api"
import type { Member } from "@/lib/api/types"

type AccountPageProps = {
  onBack: () => void
  onOpenCoupons: () => void
  onOpenInformation: () => void
  onOpenLanguage: () => void
  onOpenPoints: () => void
  onSignOut: () => void
}

const languageName: Record<Member["language"], string> = {
  en: "English",
  es: "Spanish",
  zh: "Chinese (Mainland)",
}

export function AccountPage({ onBack, onOpenCoupons, onOpenInformation, onOpenLanguage, onOpenPoints, onSignOut }: AccountPageProps) {
  const [member, setMember] = useState<Member | null>(null)

  useEffect(() => {
    let active = true

    void memberApi.getCurrent().then((nextMember) => {
      if (active) setMember(nextMember)
    })

    return () => { active = false }
  }, [])

  if (!member) return <main aria-busy="true" className="detail-screen profile-screen" />

  const items = [
    { icon: CircleDollarSign, label: "Points", onClick: onOpenPoints },
    { icon: TicketPercent, label: "Coupon", onClick: onOpenCoupons },
    { icon: Globe2, label: "Language", onClick: onOpenLanguage, value: languageName[member.language] },
  ]

  return (
    <main className="detail-screen profile-screen">
      <header className="detail-header">
        <button aria-label="Back" onClick={onBack} type="button">←</button>
        <h1 aria-label="Account">Profile</h1>
        <span aria-hidden="true" />
      </header>

      <section className="profile-member" aria-label="Member profile">
        <div className="profile-avatar" aria-hidden="true">{member.firstName.slice(0, 1)}{member.lastName.slice(0, 1)}</div>
        <div>
          <h2>{member.firstName} {member.lastName}</h2>
          <p>Member since {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${member.joinedAt}T12:00:00`))}</p>
          <p className="profile-email">{member.email}</p>
        </div>
        <button aria-label="Complete information" className="profile-edit" onClick={onOpenInformation} type="button"><Pencil aria-hidden="true" size={18} /></button>
      </section>

      <section className="profile-menu" aria-label="Account settings">
        {items.map(({ icon: Icon, label, onClick, value }) => (
          <button aria-label={label} className="profile-menu-item" key={label} onClick={onClick} type="button">
            <Icon aria-hidden="true" size={20} />
            <span>{label}</span>
            {value && <small>{value}</small>}
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        ))}
      </section>

      <button className="profile-sign-out" onClick={onSignOut} type="button">Sign Out</button>
    </main>
  )
}
