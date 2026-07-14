import { Button } from "@/components/ui/button"

const assets = {
  star: "https://www.figma.com/api/mcp/asset/6d549a28-50d6-4cb2-8c64-2468def5c220",
  hero: "https://www.figma.com/api/mcp/asset/0f8a2c53-a8cf-4244-a579-8c7d429d9d71",
  logo: "https://www.figma.com/api/mcp/asset/3c24135e-ee06-4f17-b0c6-9c236e45fb9c",
  gift: "https://www.figma.com/api/mcp/asset/9ef779b7-9577-462c-842e-6692e4edb867",
}

export type LandingScreenProps = { onJoin: () => void }

export function LandingScreen({ onJoin }: LandingScreenProps) {
  return (
    <main className="rewards-screen rewards-landing">
      <div className="landing-hero" aria-hidden="true">
        <img src={assets.hero} alt="" />
      </div>

      <div className="landing-content">
        <img className="landing-logo" src={assets.logo} alt="GreenBite" />
        <h1>Earn Rewards From Every Visit</h1>
        <p className="screen-copy landing-copy">Join GreenBite Rewards and start earning points today.</p>

        <section className="benefits" aria-label="Rewards benefits">
          <Benefit icon={assets.star} />
          <div className="benefit-divider" />
          <Benefit icon={assets.gift} />
        </section>

        <div className="screen-actions landing-actions">
          <Button className="rewards-button rewards-button-primary" onClick={onJoin}>
            Join Rewards
          </Button>
          <Button className="rewards-button rewards-button-outline" variant="outline" onClick={onJoin}>
            Already a member? Sign in
          </Button>
          <p className="screen-note">Take less than 30 seconds</p>
        </div>
      </div>
    </main>
  )
}

function Benefit({ icon }: { icon: string }) {
  return (
    <div className="benefit">
      <span className="benefit-icon" aria-hidden="true">
        <img src={icon} alt="" />
      </span>
      <div>
        <h2>Earn points every visit</h2>
        <p>1 points for every $1 you spend.</p>
      </div>
    </div>
  )
}
