import { MemoryRouter } from "react-router-dom"

import { AuthRoutes } from "@/features/auth/auth-routes"

export function RewardsFlow() {
  return (
    <MemoryRouter>
      <AuthRoutes />
    </MemoryRouter>
  )
}
