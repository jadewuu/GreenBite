import gift from "@/assets/figma-clean/auth/gift.svg"
import gem from "@/assets/figma-clean/auth/gem.svg"
import hero from "@/assets/figma-clean/auth/landing-hero.png"
import mark from "@/assets/figma-clean/auth/landing-mark.svg"
import star from "@/assets/figma-clean/auth/star.svg"
import wordmark from "@/assets/figma-clean/auth/landing-wordmark.svg"

type LandingProps = {
  onLogin: () => void
}

export function Landing({ onLogin }: LandingProps) {
  return (
    <main className="figma-frame landing-frame" data-figma-node="5:625">
      <div className="landing-frame__hero" aria-hidden="true">
        <img src={hero} alt="" />
      </div>
      <div className="auth-stack landing-stack">
        <div className="brand-inline" aria-label="GreenBite">
          <img className="brand-inline__mark" src={mark} alt="" />
          <img className="brand-inline__wordmark" src={wordmark} alt="GreenBite" />
        </div>
        <h1 className="landing-title">Earn Rewards From Every Visit</h1>
        <p className="landing-intro">Join GreenBite Rewards and start earning points today.</p>
        <section className="landing-benefits" aria-label="Member benefits">
          <div className="landing-benefit">
            <span className="landing-benefit__icon"><img src={star} alt="" /></span>
            <div className="landing-benefit__copy">
              <p className="landing-benefit__title">Earn points every visit</p>
              <p className="landing-benefit__text">1 points for every $1 you spend.</p>
            </div>
          </div>
          <div className="landing-divider" />
          <div className="landing-benefit">
            <span className="landing-benefit__icon"><img src={gem} alt="" /></span>
            <div className="landing-benefit__copy">
              <p className="landing-benefit__title">Reward for new register</p>
              <p className="landing-benefit__text">Earn 100 points for new user</p>
            </div>
          </div>
          <div className="landing-divider" />
          <div className="landing-benefit">
            <span className="landing-benefit__icon"><img src={gift} alt="" /></span>
            <div className="landing-benefit__copy">
              <p className="landing-benefit__title">Unlock free rewards</p>
              <p className="landing-benefit__text">Redeem points for free food and drinks</p>
            </div>
          </div>
        </section>
        <div className="landing-actions">
          <button className="auth-button auth-button--primary" type="button" onClick={onLogin}>Join Rewards</button>
        </div>
      </div>
    </main>
  )
}
