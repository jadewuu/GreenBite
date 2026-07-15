import { Button } from "@/components/ui/button"
import badge from "@/assets/figma/success-badge.svg"
import confetti from "@/assets/figma/success-confetti.png"

const assets = {
  confetti,
  badge,
}

export type SuccessScreenProps = {
  onViewRewards: () => void
  onAddToWallet: () => void
}

export function SuccessScreen({ onViewRewards, onAddToWallet }: SuccessScreenProps) {
  return (
    <main className="rewards-screen figma-auth figma-success">
      <div className="success-confetti success-confetti-left" aria-hidden="true"><img src={assets.confetti} alt="" /></div>
      <div className="success-confetti success-confetti-right" aria-hidden="true"><img src={assets.confetti} alt="" /></div>

      <div className="success-content">
        <img className="success-badge" src={assets.badge} alt="" aria-hidden="true" />
        <h1 className="screen-title">You earned <br />28 points</h1>
        <p className="screen-copy success-purchase">Purchase #ORD00123456</p>
        <p className="screen-copy success-copy">Points will appear in your account within 48 hours</p>

        <div className="screen-actions success-actions">
          <Button className="rewards-button rewards-button-primary" onClick={onViewRewards}>
            View Rewards
          </Button>
          <Button className="rewards-button rewards-button-outline" variant="outline" onClick={onAddToWallet}>
            Check Details
          </Button>
        </div>
      </div>
    </main>
  )
}
