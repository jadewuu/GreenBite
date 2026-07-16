import { useCallback, useState } from "react"
import { HashRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom"

import { digitsOnly, formatUsPhoneNumber, isUsPhoneNumber } from "@/lib/phone"

import { Landing } from "./pages/landing"
import { Account } from "./pages/account"
import { Coupon } from "./pages/coupon"
import { CouponDetail } from "./pages/coupon-detail"
import { Information, type InformationDraft } from "./pages/information"
import { Language } from "./pages/language"
import { Login } from "./pages/login"
import { MemberCode } from "./pages/member-code"
import { Points } from "./pages/points"
import { Rewards } from "./pages/rewards"
import { ClaimFailed, Success } from "./pages/success"
import { Verification } from "./pages/verification"
import "./styles/tokens.css"
import "./styles/auth.css"
import "./styles/rewards.css"
import "./styles/details.css"

type PhoneLocationState = { phone?: string }

function FigmaRoutes() {
  return (
    <div className="figma-app">
      <Routes>
        <Route path="/" element={<LandingRoute />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/verify" element={<VerificationRoute />} />
        <Route path="/success" element={<SuccessRoute />} />
        <Route path="/success/instant" element={<SuccessRoute variant="instant" />} />
        <Route path="/failed" element={<FailedRoute />} />
        <Route path="/rewards" element={<RewardsRoute />} />
        <Route path="/member-code" element={<MemberCodeRoute />} />
        <Route path="/account" element={<AccountRoute />} />
        <Route path="/language" element={<LanguageRoute />} />
        <Route path="/points" element={<PointsRoute />} />
        <Route path="/coupons" element={<CouponRoute />} />
        <Route path="/coupons/:couponId" element={<CouponDetailRoute />} />
        <Route path="/information/1" element={<InformationRoute step="1" />} />
        <Route path="/information/2" element={<InformationRoute step="2" />} />
      </Routes>
    </div>
  )
}

function LandingRoute() {
  const navigate = useNavigate()
  return <Landing onLogin={() => navigate("/login")} />
}

function LoginRoute() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialPhone = (location.state as PhoneLocationState | null)?.phone ?? ""
  const [phone, setPhone] = useState(() => digitsOnly(initialPhone))

  function changePhone(value: string) {
    const digits = digitsOnly(value)
    setPhone(digits)
    navigate("/login", { replace: true, state: { phone: digits } })
  }

  return (
    <Login
      canContinue={isUsPhoneNumber(phone)}
      phone={formatUsPhoneNumber(phone)}
      onBack={() => navigate(-1)}
      onContinue={() => { if (isUsPhoneNumber(phone)) navigate("/verify", { state: { phone } }) }}
      onPhoneChange={changePhone}
    />
  )
}

function VerificationRoute() {
  const location = useLocation()
  const navigate = useNavigate()
  const phone = (location.state as PhoneLocationState | null)?.phone ?? ""
  const verify = useCallback(() => navigate("/information/1", { state: { phone } }), [navigate, phone])

  return (
    <Verification
      formattedPhone={formatUsPhoneNumber(phone) || "(408) 888-1234"}
      onBack={() => navigate("/login", { state: { phone } })}
      onVerified={verify}
    />
  )
}

function SuccessRoute({ variant = "48h" }: { variant?: "48h" | "instant" }) {
  const navigate = useNavigate()
  return <Success variant={variant} onCheckDetails={() => navigate("/points")} onViewRewards={() => navigate("/rewards")} />
}

function FailedRoute() {
  const navigate = useNavigate()
  return <ClaimFailed onViewRewards={() => navigate("/rewards")} />
}

function RewardsRoute() {
  const navigate = useNavigate()
  return <Rewards onOpenAccount={() => navigate("/account")} onOpenCoupon={(couponId) => navigate(`/coupons/${couponId}`)} onOpenMemberCode={() => navigate("/member-code")} onOpenPoints={() => navigate("/points")} />
}

function MemberCodeRoute() {
  const navigate = useNavigate()
  return <MemberCode onClose={() => navigate("/rewards", { replace: true })} />
}

function AccountRoute() {
  const navigate = useNavigate()
  return (
    <Account
      onBack={() => navigate(-1)}
      onOpenCoupons={() => navigate("/coupons")}
      onOpenInformation={() => navigate("/information/1")}
      onOpenLanguage={() => navigate("/language")}
      onOpenPoints={() => navigate("/points")}
      onSignOut={() => navigate("/", { replace: true })}
    />
  )
}

function LanguageRoute() {
  const navigate = useNavigate()
  return <Language onBack={() => navigate(-1)} />
}

function PointsRoute() {
  const navigate = useNavigate()
  return <Points onBack={() => navigate(-1)} />
}

function CouponRoute() {
  const navigate = useNavigate()
  return <Coupon onBack={() => navigate(-1)} onOpenCoupon={(couponId) => navigate(`/coupons/${couponId}`)} />
}

function CouponDetailRoute() {
  const location = useLocation()
  const navigate = useNavigate()
  const couponId = location.pathname.split("/").at(-1) ?? "coupon-1"
  return <CouponDetail couponId={couponId} onClose={() => navigate(-1)} />
}

function InformationRoute({ step }: { step: "1" | "2" }) {
  const location = useLocation()
  const navigate = useNavigate()
  const draft = (location.state as { draft?: InformationDraft } | null)?.draft
  return (
    <Information
      draft={draft}
      key={step}
      onBack={(currentDraft) => {
        if (step === "2") {
          navigate("/information/1", { replace: true, state: { draft: currentDraft } })
        } else {
          navigate(-1)
        }
      }}
      onSaved={() => navigate("/success/instant", { replace: true })}
      step={step}
    />
  )
}

export function FigmaApp() {
  return <HashRouter><FigmaRoutes /></HashRouter>
}
