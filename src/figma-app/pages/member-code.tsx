import { useEffect, useState } from "react"

import closeIcon from "@/assets/figma-clean/rewards/close.svg"
import memberEmblem from "@/assets/figma-clean/rewards/member-emblem.svg"
import qrMask from "@/assets/figma-clean/rewards/member-qr-mask.svg"
import qrSource from "@/assets/figma-clean/rewards/member-qr-source.jpg"
import memberWordmark from "@/assets/figma-clean/rewards/member-wordmark.svg"
import walletClip1 from "@/assets/figma-clean/rewards/wallet-clip-1.svg"
import walletClip2 from "@/assets/figma-clean/rewards/wallet-clip-2.svg"
import walletClip from "@/assets/figma-clean/rewards/wallet-clip.svg"
import walletGroup1 from "@/assets/figma-clean/rewards/wallet-group-1.svg"
import walletGroup2 from "@/assets/figma-clean/rewards/wallet-group-2.svg"
import walletGroup3 from "@/assets/figma-clean/rewards/wallet-group-3.svg"
import walletGroup4 from "@/assets/figma-clean/rewards/wallet-group-4.svg"
import walletGroup5 from "@/assets/figma-clean/rewards/wallet-group-5.svg"
import walletGroup from "@/assets/figma-clean/rewards/wallet-group.svg"
import walletVector from "@/assets/figma-clean/rewards/wallet-vector.svg"
import { memberApi } from "@/lib/api/member-api"
import type { Member } from "@/lib/api/types"

export function MemberCode({ onClose }: { onClose: () => void }) {
  const [member, setMember] = useState<Member | null>(null)
  const [walletStatus, setWalletStatus] = useState("")

  useEffect(() => { void memberApi.getCurrent().then(setMember) }, [])
  useEffect(() => {
    if (!walletStatus) return
    const timeout = window.setTimeout(() => setWalletStatus(""), 2400)
    return () => window.clearTimeout(timeout)
  }, [walletStatus])

  if (!member) return <main className="figma-frame member-code-clean" aria-busy="true" />

  return (
    <main className="figma-frame member-code-clean" data-figma-node="35:38">
      <header><button aria-label="Close member code" className="member-close-clean" onClick={onClose} type="button"><img alt="" src={closeIcon} /></button><h1>Member Code</h1><span /></header>
      <section aria-label="GreenBite member code" className="member-card-clean">
        <div className="member-banner-clean">
          <img alt="" src={memberEmblem} /><img alt="GreenBite" src={memberWordmark} />
        </div>
        <div className="member-card-body-clean">
          <div className="member-card-data-clean">
            <div><span>MEMBER NAME</span><strong>{member.firstName} {member.lastName.charAt(0)}.</strong></div>
            <div><span>POINTS</span><strong>{member.points.toLocaleString("en-US")}</strong></div>
          </div>
          <div className="member-qr-clean" style={{ backgroundImage: `url(${qrSource})`, maskImage: `url(${qrMask})` }} />
          <p className="member-code-number">{member.memberCode}</p>
          <button aria-label="Add to Apple Wallet" className="apple-wallet-clean" onClick={() => setWalletStatus("Added to Apple Wallet for this demo.")} type="button">
            <img alt="" className="wallet-shape" src={walletVector} />
            <span className="wallet-icon">
              <img alt="" src={walletClip} /><img alt="" src={walletClip1} /><img alt="" src={walletClip2} />
              <img alt="" className="wallet-color wallet-color-1" src={walletGroup} />
              <img alt="" className="wallet-color wallet-color-2" src={walletGroup1} />
              <img alt="" className="wallet-color wallet-color-3" src={walletGroup2} />
              <img alt="" className="wallet-color wallet-color-4" src={walletGroup3} />
            </span>
            <img alt="Add to" className="wallet-add" src={walletGroup5} />
            <img alt="Apple Wallet" className="wallet-name" src={walletGroup4} />
          </button>
          <p aria-atomic="true" aria-live="polite" className="wallet-status-clean" role="status">{walletStatus}</p>
        </div>
      </section>
    </main>
  )
}
