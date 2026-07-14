import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { digitsOnly, formatUsPhoneNumber, isUsPhoneNumber } from "@/lib/phone"

const assets = {
  arrow: "https://www.figma.com/api/mcp/asset/f5e3ea15-2c28-460e-acd9-87890ea72098",
  mark: "https://www.figma.com/api/mcp/asset/b88701d5-212a-45d3-9f14-1b3a2e7d2fd4",
  wordmark: "https://www.figma.com/api/mcp/asset/1bd96a6b-d08e-4caa-a8e2-710d3e3f40d8",
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
    <main className="rewards-screen rewards-centered-screen">
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
          placeholder="Phone number"
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
