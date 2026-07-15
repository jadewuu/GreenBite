import type { ReactNode } from "react"

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-stage">
      <div className="app-canvas" data-testid="app-canvas">
        {children}
      </div>
    </div>
  )
}
