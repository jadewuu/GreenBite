import { useEffect, useRef, useState } from "react"

import arrowLeft from "@/assets/figma-clean/auth/verify-arrow-left.svg"
import mark from "@/assets/figma-clean/auth/verify-mark.svg"
import wordmark from "@/assets/figma-clean/auth/verify-wordmark.svg"

import { useLockedViewportHeight } from "../use-locked-viewport-height"

const emptyDigits = ["", "", "", "", "", ""]

type VerificationProps = {
  formattedPhone: string
  onBack: () => void
  onVerified: () => void
}

export function Verification({ formattedPhone, onBack, onVerified }: VerificationProps) {
  const frameRef = useLockedViewportHeight<HTMLElement>()
  const [digits, setDigits] = useState(emptyDigits)
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")
  const [seconds, setSeconds] = useState(31)
  const refs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => Math.max(value - 1, 0)), 1000)
    return () => window.clearInterval(timer)
  }, [])

  function clearCode() {
    setDigits(emptyDigits)
    refs.current[0]?.focus()
  }

  function updateDigit(index: number, value: string) {
    const incoming = value.replace(/\D/g, "")
    setError("")
    setStatus("")
    if (!incoming) {
      setDigits((current) => current.map((digit, digitIndex) => digitIndex === index ? "" : digit))
      return
    }

    const nextDigits = [...digits]
    incoming.slice(0, 6 - index).split("").forEach((digit, offset) => {
      nextDigits[index + offset] = digit
    })
    setDigits(nextDigits)
    refs.current[Math.min(index + incoming.length, 5)]?.focus()

    if (nextDigits.every(Boolean)) {
      if (nextDigits.join("") === "123456") {
        onVerified()
      } else {
        setError("Invalid verification code. Try 123456.")
        clearCode()
      }
    }
  }

  function resendCode() {
    if (seconds > 0) return
    setError("")
    setStatus("Verification code resent.")
    setSeconds(31)
    clearCode()
  }

  return (
    <main ref={frameRef} className="figma-frame auth-frame" data-figma-node="5:2678">
      <div className="auth-stack auth-entry-stack">
        <button className="auth-back" type="button" aria-label="Go back" onClick={onBack}>
          <img src={arrowLeft} alt="" />
        </button>
        <div className="brand-stacked" aria-label="GreenBite">
          <img className="brand-stacked__mark" src={mark} alt="" />
          <img className="brand-stacked__wordmark" src={wordmark} alt="GreenBite" />
        </div>
        <h1 className="auth-title verification-title">Verify your phone</h1>
        <p className="verification-copy">Please enter the 6-digits verification code sent to {formattedPhone}</p>
        <div className="otp-shell">
          <div className="otp-fields">
            {digits.map((digit, index) => (
              <input
                // The six Figma slots are intentionally individual controls.
                key={index}
                ref={(element) => { refs.current[index] = element }}
                className="otp-field"
                aria-label="Verification digit"
                autoFocus={index === 0}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => updateDigit(index, event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && !digit && index > 0) refs.current[index - 1]?.focus()
                }}
              />
            ))}
          </div>
          {error && <p className="verification-feedback verification-feedback--error" role="alert">{error}</p>}
          {status && <p className="verification-feedback" role="status">{status}</p>}
        </div>
        <button className="resend-button" type="button" disabled={seconds > 0} onClick={resendCode}>
          {seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
        </button>
      </div>
    </main>
  )
}
