import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"

import { memberApi } from "@/lib/api/member-api"
import type { Member } from "@/lib/api/types"

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
        <button aria-label="Close member code" onClick={onClose} type="button">
          <X aria-hidden="true" size={20} />
        </button>
      </header>

      <section className="member-code-card" aria-label="GreenBite member code">
        <div className="member-code-banner">
          <span>GREENBITE</span>
          <small>REWARDS</small>
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
        <div className="member-qr" aria-label={`Member ID ${member.memberId}`}>
          <span />
          <span />
          <span />
        </div>
        <p className="member-id-code">{member.memberId}</p>
        <button className="wallet-button member-wallet-button" onClick={() => toast("Added to Apple Wallet locally.")} type="button">
          Add to Apple Wallet
        </button>
      </section>
    </main>
  )
}
