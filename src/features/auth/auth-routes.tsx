import { type ReactNode, useState } from "react"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { Toaster, toast } from "sonner"

import { LandingScreen } from "@/components/screens/landing-screen"
import { LoginScreen } from "@/components/screens/login-screen"
import { SuccessScreen } from "@/components/screens/success-screen"
import { VerificationScreen } from "@/components/screens/verification-screen"

type PhoneState = { phone?: string }

export function AuthRoutes({ children }: { children?: ReactNode }) {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingRoute />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/verify" element={<VerificationRoute />} />
        <Route path="/success" element={<SuccessRoute />} />
        <Route path="/rewards" element={<RewardsPlaceholder />} />
        {children}
      </Routes>
    </>
  )
}

function LandingRoute() {
  const navigate = useNavigate()

  return <LandingScreen onJoin={() => navigate("/login")} />
}

function LoginRoute() {
  const location = useLocation()
  const navigate = useNavigate()
  const [phone, setPhone] = useState(() => (location.state as PhoneState | null)?.phone ?? "")

  function updatePhone(value: string) {
    setPhone(value)
    navigate("/login", { replace: true, state: { phone: value } })
  }

  return (
    <LoginScreen
      phone={phone}
      onPhoneChange={updatePhone}
      onBack={() => navigate(-1)}
      onContinue={() => navigate("/verify", { state: { phone } })}
    />
  )
}

function VerificationRoute() {
  const location = useLocation()
  const navigate = useNavigate()
  const phone = (location.state as PhoneState | null)?.phone ?? ""

  return (
    <VerificationScreen
      phone={phone}
      onBack={() => navigate(-1)}
      onResend={() => toast("Verification code resent.")}
      onVerified={() => navigate("/success", { state: { phone } })}
    />
  )
}

function SuccessRoute() {
  const location = useLocation()
  const navigate = useNavigate()
  const phone = (location.state as PhoneState | null)?.phone ?? ""

  return (
    <SuccessScreen
      onViewRewards={() => navigate("/rewards", { state: { phone } })}
      onAddToWallet={() => toast("Apple Wallet is not available in this demo.")}
    />
  )
}

function RewardsPlaceholder() {
  return (
    <main>
      <h1>Rewards &amp; Coupon</h1>
    </main>
  )
}
