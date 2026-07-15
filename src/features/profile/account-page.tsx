import { useEffect, useState } from "react"
import { ChevronRight, CircleDollarSign, Globe2, TicketPercent } from "lucide-react"

import profileArrowLeft from "@/assets/figma/icon-arrow-left.svg"
import profileEdit from "@/assets/figma/icon-profile-edit.svg"
import profileAndrew from "@/assets/figma/profile-andrew.png"
import { memberApi } from "@/lib/api/member-api"
import type { Member } from "@/lib/api/types"
import "@/styles/profile-figma.css"

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
    <main className="detail-screen profile-screen figma-profile-screen">
      <header className="detail-header figma-detail-header">
        <button aria-label="Back" onClick={onBack} type="button"><img alt="" src={profileArrowLeft} /></button>
        <h1 aria-label="Account">Profile</h1>
        <span aria-hidden="true" />
      </header>

      <section className="profile-member" aria-label="Member profile">
        <div className="profile-avatar"><img alt="" src={profileAndrew} /></div>
        <div>
          <h2>{member.firstName} {member.lastName}</h2>
          <p>Member since {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${member.joinedAt}T12:00:00`))}</p>
          <p className="sr-only">{member.email}</p>
        </div>
        <button aria-label="Complete information" className="profile-edit" onClick={onOpenInformation} type="button"><img alt="" src={profileEdit} /></button>
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
