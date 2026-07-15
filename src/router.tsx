import { HashRouter, Route, useNavigate } from "react-router-dom"

import { AuthRoutes } from "./features/auth/auth-routes"
import { MemberCodePage } from "./features/rewards/member-code-page"

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

export function AppRouter() {
  return (
    <HashRouter>
      <AuthRoutes>
        <Route path="/member-code" element={<MemberCodeRoute />} />
        <Route path="/points" element={<RoutePlaceholder title="Points" />} />
        <Route path="/coupons" element={<RoutePlaceholder title="Coupons" />} />
        <Route path="/account" element={<RoutePlaceholder title="Account" />} />
        <Route path="/language" element={<RoutePlaceholder title="Language" />} />
        <Route path="/information/:step" element={<RoutePlaceholder title="Complete Information" />} />
      </AuthRoutes>
    </HashRouter>
  )
}
