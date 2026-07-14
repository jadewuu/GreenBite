import { Button } from "@/components/ui/button"

const assets = {
  confetti: "https://www.figma.com/api/mcp/asset/fbaf611f-2728-41a8-82ca-d239c04bb4c3",
  wallet: "https://www.figma.com/api/mcp/asset/f30b3a61-9fe0-49ae-b81f-158df557945e",
  badge: "https://www.figma.com/api/mcp/asset/02148d0e-7070-4d78-94a5-36a4e1d6bfdf",
}

export type SuccessScreenProps = {
  onViewRewards: () => void
  onAddToWallet: () => void
}

export function SuccessScreen({ onViewRewards, onAddToWallet }: SuccessScreenProps) {
  return (
    <main className="rewards-screen rewards-success">
      <div className="success-confetti success-confetti-left" aria-hidden="true"><img src={assets.confetti} alt="" /></div>
      <div className="success-confetti success-confetti-right" aria-hidden="true"><img src={assets.confetti} alt="" /></div>

      <div className="success-content">
        <img className="success-badge" src={assets.badge} alt="" aria-hidden="true" />
        <h1 className="screen-title">You earned<br />28 points</h1>
        <p className="screen-copy success-copy">Your visit has been added to your rewards account</p>

        <div className="screen-actions success-actions">
          <Button className="rewards-button rewards-button-primary" onClick={onViewRewards}>
            View Rewards
          </Button>
          <Button className="rewards-button rewards-button-outline wallet-button" variant="outline" onClick={onAddToWallet}>
            <img src={assets.wallet} alt="" aria-hidden="true" />
            Add to Apple Wallet
          </Button>
        </div>
      </div>
    </main>
  )
}
