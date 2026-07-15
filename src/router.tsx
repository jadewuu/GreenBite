import { HashRouter, Route, Routes } from "react-router-dom"

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
      <Routes>
        <Route path="/" element={<RoutePlaceholder title="GreenBite" />} />
        <Route path="/login" element={<RoutePlaceholder title="Login" />} />
        <Route path="/verify" element={<RoutePlaceholder title="Verify" />} />
        <Route path="/success" element={<RoutePlaceholder title="Success" />} />
        <Route path="/rewards" element={<RoutePlaceholder title="Rewards & Coupon" />} />
        <Route path="/member-code" element={<RoutePlaceholder title="Member Code" />} />
        <Route path="/points" element={<RoutePlaceholder title="Points" />} />
        <Route path="/coupons" element={<RoutePlaceholder title="Coupons" />} />
        <Route path="/account" element={<RoutePlaceholder title="Account" />} />
        <Route path="/language" element={<RoutePlaceholder title="Language" />} />
        <Route path="/information/:step" element={<RoutePlaceholder title="Complete Information" />} />
      </Routes>
    </HashRouter>
  )
}
