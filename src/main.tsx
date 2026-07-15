import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { AppShell } from "./components/app-shell"
import "./index.css"
import "./styles/auth-figma.css"
import { AppRouter } from "./router"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppShell>
      <AppRouter />
    </AppShell>
  </StrictMode>,
)
