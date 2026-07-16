import badge from "@/assets/figma-clean/auth/badge-check.svg"
import confetti from "@/assets/figma-clean/auth/confetti.png"

type SuccessProps = {
  variant: "48h" | "instant"
  onCheckDetails: () => void
  onViewRewards: () => void
}

export function Success({ variant, onCheckDetails, onViewRewards }: SuccessProps) {
  const isInstant = variant === "instant"

  return (
    <main className="figma-frame success-frame" data-figma-node={isInstant ? "64:1591" : "5:2952"}>
      <div className="success-frame__confetti success-frame__confetti--left" aria-hidden="true"><img src={confetti} alt="" /></div>
      <div className="success-frame__confetti success-frame__confetti--right" aria-hidden="true"><img src={confetti} alt="" /></div>
      <div className="auth-stack success-stack">
        <img className="success-badge" src={badge} alt="" />
        <h1 className="auth-title success-title">You earned 28 points</h1>
        <p className="success-copy">Purchase #ORD00123456</p>
        <p className="success-copy">{isInstant ? "Your visit has been added to your rewards account." : "Points will appear in your account within 48 hours"}</p>
        <div className="success-actions">
          <button className="auth-button auth-button--primary" type="button" onClick={onViewRewards}>View Rewards</button>
          <button className="auth-button auth-button--outline" type="button" onClick={onCheckDetails}>Check Details</button>
        </div>
      </div>
    </main>
  )
}

type ClaimFailedProps = {
  onViewRewards: () => void
}

export function ClaimFailed({ onViewRewards }: ClaimFailedProps) {
  return (
    <main className="figma-frame claim-failed-frame" data-figma-node="42:3899">
      <div className="claim-failed-stack">
        <span className="claim-failed-icon" aria-hidden="true" />
        <h1 className="auth-title claim-failed-title">Already Claimed</h1>
        <p className="claim-failed-copy">These points had already been claimed</p>
        <p className="claim-failed-support">Need help? Contact us <a href="mailto:Support@mail.com">Support@mail.com</a></p>
        <button className="auth-button auth-button--primary" type="button" onClick={onViewRewards}>View Rewards</button>
      </div>
    </main>
  )
}
