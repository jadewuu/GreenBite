import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import arrow from "@/assets/figma/auth-arrow.svg"
import mark from "@/assets/figma/auth-mark.svg"
import wordmark from "@/assets/figma/auth-wordmark.svg"
import { digitsOnly, formatUsPhoneNumber, isUsPhoneNumber } from "@/lib/phone"

const assets = {
  arrow,
  mark,
  wordmark,
}

export type LoginScreenProps = {
  phone: string
  onPhoneChange: (value: string) => void
  onBack: () => void
  onContinue: () => void
}

export function LoginScreen({ phone, onPhoneChange, onBack, onContinue }: LoginScreenProps) {
  const isValid = isUsPhoneNumber(phone)

  return (
    <main className="rewards-screen figma-auth figma-login">
      <header className="screen-back-row">
        <Button className="back-button" variant="ghost" size="icon" onClick={onBack} aria-label="Go back">
          <img src={assets.arrow} alt="" aria-hidden="true" />
        </Button>
      </header>

      <Brand />
      <h1 className="screen-title login-title">Enter your phone number</h1>

      <label className="phone-input-wrap">
        <span aria-hidden="true">+1</span>
        <Input
          aria-label="Phone number"
          inputMode="tel"
          value={formatUsPhoneNumber(phone)}
          onChange={(event) => onPhoneChange(digitsOnly(event.target.value))}
          placeholder="(408) 888-8888"
        />
      </label>

      <Button className="rewards-button rewards-button-primary" disabled={!isValid} onClick={onContinue}>
        Continue
      </Button>

      <p className="login-terms">
        By logging in, you agree to the our <a href="#terms">Terms of use</a>
        <br />
        and <a href="#privacy">Privacy Policy</a>
      </p>
    </main>
  )
}

function Brand() {
  return (
    <div className="brand" aria-label="GreenBite">
      <img src={assets.mark} alt="" aria-hidden="true" />
      <img src={assets.wordmark} alt="" aria-hidden="true" />
    </div>
  )
}
