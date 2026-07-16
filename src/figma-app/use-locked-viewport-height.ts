import { useLayoutEffect, useRef } from "react"

let lockedHeight: number | null = null
let releaseTimer: number | null = null

export function useLockedViewportHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const frame = ref.current
    if (!frame) return

    if (releaseTimer !== null) {
      window.clearTimeout(releaseTimer)
      releaseTimer = null
    }

    const applyHeight = () => {
      const height = lockedHeight ?? window.innerHeight
      frame.style.setProperty("--gb-locked-viewport-height", `${height}px`)
      document.documentElement.style.setProperty("--gb-locked-viewport-height", `${height}px`)
    }
    const lockOrientationHeight = () => {
      lockedHeight = window.innerHeight
      applyHeight()
    }

    if (lockedHeight === null) lockedHeight = window.innerHeight
    applyHeight()
    window.addEventListener("orientationchange", lockOrientationHeight)

    return () => {
      window.removeEventListener("orientationchange", lockOrientationHeight)
      frame.style.removeProperty("--gb-locked-viewport-height")
      releaseTimer = window.setTimeout(() => {
        lockedHeight = null
        document.documentElement.style.removeProperty("--gb-locked-viewport-height")
        releaseTimer = null
      }, 0)
    }
  }, [])

  return ref
}
