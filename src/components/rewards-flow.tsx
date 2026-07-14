import { useState } from "react"
import { Toaster, toast } from "sonner"

import { LandingScreen } from "./screens/landing-screen"
import { LoginScreen } from "./screens/login-screen"
import { SuccessScreen } from "./screens/success-screen"
import { VerificationScreen } from "./screens/verification-screen"

type Screen = "landing" | "login" | "verification" | "success"

export function RewardsFlow() {
  const [screen, setScreen] = useState<Screen>("landing")
  const [phone, setPhone] = useState("")

  function renderScreen() {
    switch (screen) {
      case "login":
        return (
          <LoginScreen
            phone={phone}
            onPhoneChange={setPhone}
            onBack={() => setScreen("landing")}
            onContinue={() => setScreen("verification")}
          />
        )
      case "verification":
        return <VerificationScreen phone={phone} onBack={() => setScreen("login")} onResend={() => toast("Verification code resent.")} onVerified={() => setScreen("success")} />
      case "success":
        return (
          <SuccessScreen
            onViewRewards={() => {
              setPhone("")
              setScreen("landing")
            }}
            onAddToWallet={() => toast("Apple Wallet is not available in this demo.")}
          />
        )
      default:
        return <LandingScreen onJoin={() => setScreen("login")} />
    }
  }

  return <><Toaster />{renderScreen()}</>
}
