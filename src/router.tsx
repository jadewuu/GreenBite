import { HashRouter, Route, useNavigate } from "react-router-dom"

import { AuthRoutes } from "./features/auth/auth-routes"
import { MemberCodePage } from "./features/rewards/member-code-page"
import { CouponsPage } from "./features/rewards/coupons-page"
import { PointsPage } from "./features/rewards/points-page"

function RoutePlaceholder({ title }: { title: string }) {
  return (
    <main>
      <h1>{title}</h1>
    </main>
  )
}

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

export function AppRouter() {
  return (
    <HashRouter>
      <AuthRoutes>
        <Route path="/member-code" element={<MemberCodeRoute />} />
        <Route path="/points" element={<PointsRoute />} />
        <Route path="/coupons" element={<CouponsRoute />} />
        <Route path="/account" element={<RoutePlaceholder title="Account" />} />
        <Route path="/language" element={<RoutePlaceholder title="Language" />} />
        <Route path="/information/:step" element={<RoutePlaceholder title="Complete Information" />} />
      </AuthRoutes>
    </HashRouter>
  )
}
