import arrowLeft from "@/assets/figma-clean/auth/arrow-left.svg"
import mark from "@/assets/figma-clean/auth/auth-mark.svg"
import wordmark from "@/assets/figma-clean/auth/auth-wordmark.svg"

import { useLockedViewportHeight } from "../use-locked-viewport-height"

type LoginProps = {
  canContinue: boolean
  phone: string
  onBack: () => void
  onContinue: () => void
  onPhoneChange: (value: string) => void
}

export function Login({ canContinue, phone, onBack, onContinue, onPhoneChange }: LoginProps) {
  const frameRef = useLockedViewportHeight<HTMLElement>()

  return (
    <main ref={frameRef} className="figma-frame auth-frame" data-figma-node="47:836">
      <div className="auth-stack auth-entry-stack">
        <button className="auth-back" type="button" aria-label="Go back" onClick={onBack}>
          <img src={arrowLeft} alt="" />
        </button>
        <div className="brand-stacked" aria-label="GreenBite">
          <img className="brand-stacked__mark" src={mark} alt="" />
          <img className="brand-stacked__wordmark" src={wordmark} alt="GreenBite" />
        </div>
        <h1 className="auth-title login-title">Enter your phone number</h1>
        <label className="phone-field">
          <span className="phone-field__prefix">+1</span>
          <input
            aria-label="Phone number"
            autoComplete="tel-national"
            inputMode="numeric"
            placeholder="Phone number"
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
          />
        </label>
        <button className="auth-button auth-button--primary" type="button" disabled={!canContinue} onClick={onContinue}>Continue</button>
      </div>
      <div className="auth-legal">
        <p>By logging in, you agree to the our <a href="#terms">Terms of use</a></p>
        <p>and <a href="#privacy">Privacy Policy</a></p>
      </div>
    </main>
  )
}
