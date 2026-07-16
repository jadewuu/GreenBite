import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { FigmaApp } from "./figma-app/app"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FigmaApp />
  </StrictMode>,
)
