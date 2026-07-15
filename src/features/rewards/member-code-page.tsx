import { useEffect, useState } from "react"
import { toast } from "sonner"

import { memberApi } from "@/lib/api/member-api"
import type { Member } from "@/lib/api/types"
import "@/styles/rewards-figma.css"
import logoMark from "@/assets/figma/member-logo-mark.svg"
import logoWordmark from "@/assets/figma/member-logo-wordmark.svg"
import closeIcon from "@/assets/figma/member-close.svg"

type MemberCodePageProps = {
  onClose?: () => void
}

export function MemberCodePage({ onClose }: MemberCodePageProps) {
  const [member, setMember] = useState<Member | null>(null)

  useEffect(() => {
    void memberApi.getCurrent().then(setMember)
  }, [])

  if (!member) {
    return <main className="rewards-screen member-code-screen" aria-busy="true" />
  }

  const memberName = `${member.firstName} ${member.lastName.charAt(0)}.`

  return (
    <main className="rewards-screen member-code-screen">
      <header className="member-code-header">
        <span />
        <h1>Member Code</h1>
        <span />
      </header>

      <section className="member-code-card" aria-label="GreenBite member code">
        <div className="member-code-banner">
          <img alt="" src={logoMark} />
          <img alt="GreenBite" src={logoWordmark} />
        </div>
        <div className="member-code-details">
          <div>
            <p>MEMBER NAME</p>
            <strong>{memberName}</strong>
          </div>
          <div>
            <p>POINTS</p>
            <strong>{member.points.toLocaleString("en-US")}</strong>
          </div>
        </div>
        <div className="member-qr" aria-label={`Member ID ${member.memberId}`} />
        <p className="member-id-code">123456789999999999999</p>
        <button className="wallet-button member-wallet-button" onClick={() => toast("Added to Apple Wallet locally.")} type="button">
          <span aria-hidden="true" />
          <span className="sr-only">Add to Apple Wallet</span>
        </button>
      </section>
      <button className="member-code-close" aria-label="Close member code" onClick={onClose} type="button"><img alt="" src={closeIcon} /></button>
    </main>
  )
}
