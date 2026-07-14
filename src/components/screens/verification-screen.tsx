import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatUsPhoneNumber } from "@/lib/phone"

const arrow = "https://www.figma.com/api/mcp/asset/abb2bf04-1992-47c4-8426-7b4a3f0fab3c"
const mark = "https://www.figma.com/api/mcp/asset/58dd70bb-4dee-4fbc-99b7-12e3478f785b"
const wordmark = "https://www.figma.com/api/mcp/asset/73d78be1-f698-48ef-9fe0-f5b320302420"
const emptyDigits = ["", "", "", "", "", ""]

export type VerificationScreenProps = {
  phone: string
  onBack: () => void
  onVerified: () => void
}

export function VerificationScreen({ phone, onBack, onVerified }: VerificationScreenProps) {
  const [digits, setDigits] = useState(emptyDigits)
  const [error, setError] = useState("")
  const [resendSeconds, setResendSeconds] = useState(31)
  const inputs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (resendSeconds === 0) return

    const interval = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(seconds - 1, 0))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [resendSeconds])

  function clearCode() {
    setDigits(emptyDigits)
    window.requestAnimationFrame(() => inputs.current[0]?.focus())
  }

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1)
    const nextDigits = digits.map((current, currentIndex) => (currentIndex === index ? digit : current))
    setDigits(nextDigits)
    setError("")

    if (digit && index < nextDigits.length - 1) inputs.current[index + 1]?.focus()

    if (nextDigits.every(Boolean)) {
      if (nextDigits.join("") === "123456") {
        onVerified()
      } else {
        setError("Invalid verification code. Try 123456.")
        clearCode()
      }
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) inputs.current[index - 1]?.focus()
  }

  function resendCode() {
    if (resendSeconds > 0) return
    setError("")
    setResendSeconds(31)
    clearCode()
  }

  return (
    <main className="rewards-screen rewards-centered-screen verification-screen">
      <header className="screen-back-row">
        <Button className="back-button" variant="ghost" size="icon" onClick={onBack} aria-label="Go back">
          <img src={arrow} alt="" aria-hidden="true" />
        </Button>
      </header>

      <div className="brand" aria-label="GreenBite">
        <img src={mark} alt="" aria-hidden="true" />
        <img src={wordmark} alt="" aria-hidden="true" />
      </div>
      <h1 className="screen-title">Verify your phone</h1>
      <p className="screen-copy verification-copy">
        Please enter the 6-digits verification code sent to {formatUsPhoneNumber(phone)}
      </p>

      <div className="otp-inputs" aria-label="Verification code">
        {digits.map((digit, index) => (
          <Input
            key={index}
            ref={(element) => {
              inputs.current[index] = element
            }}
            aria-label="Verification digit"
            autoComplete="one-time-code"
            autoFocus={index === 0}
            className="otp-input"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
          />
        ))}
      </div>

      {error && <p className="otp-error" role="alert">{error}</p>}

      <Button className="resend-button" variant="ghost" disabled={resendSeconds > 0} onClick={resendCode}>
        {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : "Resend code"}
      </Button>
    </main>
  )
}
