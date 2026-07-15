import { Button } from "@/components/ui/button"
import gift from "@/assets/figma/landing-gift.svg"
import hero from "@/assets/figma/landing-hero.png"
import mark from "@/assets/figma/landing-mark.svg"
import star from "@/assets/figma/landing-star.svg"
import wordmark from "@/assets/figma/landing-wordmark.svg"

const assets = {
  star,
  hero,
  mark,
  wordmark,
  gift,
}

export type LandingScreenProps = { onJoin: () => void }

export function LandingScreen({ onJoin }: LandingScreenProps) {
  return (
    <main className="rewards-screen figma-auth figma-landing">
      <div className="landing-hero" aria-hidden="true">
        <img src={assets.hero} alt="" />
      </div>

      <div className="landing-content">
        <div className="landing-logo" aria-label="GreenBite">
          <img src={assets.mark} alt="" aria-hidden="true" />
          <img src={assets.wordmark} alt="" aria-hidden="true" />
        </div>
        <h1>Earn Rewards From Every Visit</h1>
        <p className="screen-copy landing-copy">Join GreenBite Rewards and start earning points today.</p>

        <section className="benefits" aria-label="Rewards benefits">
          <Benefit icon={assets.star} title="Earn points every visit" copy="1 points for every $1 you spend." />
          <div className="benefit-divider" />
          <Benefit icon={assets.gift} title="Unlock free rewards" copy="Redeem points for free and drinks" />
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

function Benefit({ icon, title, copy }: { icon: string; title: string; copy: string }) {
  return (
    <div className="benefit">
      <span className="benefit-icon" aria-hidden="true">
        <img src={icon} alt="" />
      </span>
      <div>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
    </div>
  )
}
