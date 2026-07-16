import { useLayoutEffect, useRef } from "react"

export function useLockedViewportHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const frame = ref.current
    if (!frame) return

    const lockHeight = () => frame.style.setProperty("--gb-locked-viewport-height", `${window.innerHeight}px`)
    lockHeight()
    window.addEventListener("orientationchange", lockHeight)

    return () => {
      window.removeEventListener("orientationchange", lockHeight)
      frame.style.removeProperty("--gb-locked-viewport-height")
    }
  }, [])

  return ref
}
