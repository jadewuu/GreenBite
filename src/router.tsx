import { HashRouter, Route, useNavigate, useParams } from "react-router-dom"

import { AuthRoutes } from "./features/auth/auth-routes"
import { MemberCodePage } from "./features/rewards/member-code-page"
import { CouponsPage } from "./features/rewards/coupons-page"
import { PointsPage } from "./features/rewards/points-page"
import { AccountPage } from "./features/profile/account-page"
import { InformationPage } from "./features/profile/information-page"
import { LanguagePage } from "./features/profile/language-page"

function MemberCodeRoute() {
  const navigate = useNavigate()

  return <MemberCodePage onClose={() => navigate("/rewards", { replace: true })} />
}

function PointsRoute() {
  const navigate = useNavigate()

  return <PointsPage onBack={() => navigate("/rewards", { replace: true })} />
}

function CouponsRoute() {
  const navigate = useNavigate()

  return <CouponsPage onBack={() => navigate("/rewards", { replace: true })} />
}

function AccountRoute() {
  const navigate = useNavigate()

  return <AccountPage onBack={() => navigate("/rewards", { replace: true })} onOpenCoupons={() => navigate("/coupons")} onOpenInformation={() => navigate("/information/1")} onOpenLanguage={() => navigate("/language")} onOpenPoints={() => navigate("/points")} onSignOut={() => navigate("/", { replace: true })} />
}

function LanguageRoute() {
  const navigate = useNavigate()

  return <LanguagePage onBack={() => navigate("/account", { replace: true })} />
}

function InformationRoute() {
  const navigate = useNavigate()
  const { step } = useParams()
  const currentStep = step === "2" ? "2" : "1"

  return <InformationPage onBack={() => navigate(currentStep === "2" ? "/information/1" : "/account", { replace: true })} onContinue={() => navigate("/information/2")} onSaved={() => navigate("/account", { replace: true })} step={currentStep} />
}

export function AppRouter() {
  return (
    <HashRouter>
      <AuthRoutes>
        <Route path="/member-code" element={<MemberCodeRoute />} />
        <Route path="/points" element={<PointsRoute />} />
        <Route path="/coupons" element={<CouponsRoute />} />
        <Route path="/account" element={<AccountRoute />} />
        <Route path="/language" element={<LanguageRoute />} />
        <Route path="/information/:step" element={<InformationRoute />} />
      </AuthRoutes>
    </HashRouter>
  )
}
