import { HashRouter, Route } from "react-router-dom"

import { AuthRoutes } from "./features/auth/auth-routes"

function RoutePlaceholder({ title }: { title: string }) {
  return (
    <main>
      <h1>{title}</h1>
    </main>
  )
}

export function AppRouter() {
  return (
    <HashRouter>
      <AuthRoutes>
        <Route path="/member-code" element={<RoutePlaceholder title="Member Code" />} />
        <Route path="/points" element={<RoutePlaceholder title="Points" />} />
        <Route path="/coupons" element={<RoutePlaceholder title="Coupons" />} />
        <Route path="/account" element={<RoutePlaceholder title="Account" />} />
        <Route path="/language" element={<RoutePlaceholder title="Language" />} />
        <Route path="/information/:step" element={<RoutePlaceholder title="Complete Information" />} />
      </AuthRoutes>
    </HashRouter>
  )
}
