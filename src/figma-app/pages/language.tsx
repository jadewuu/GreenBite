import { useEffect, useState } from "react"

import languageArrow from "@/assets/figma-clean/details/language-arrow-left.svg"
import { memberApi } from "@/lib/api/member-api"
import type { Member } from "@/lib/api/types"

import { DetailHeader } from "./detail-header"

const LANGUAGE_STORAGE_KEY = "greenbite-language"

const languages: Array<{ label: string; value: Member["language"] }> = [
  { label: "English", value: "en" },
  { label: "中文（大陆）", value: "zh" },
]

export function Language({ onBack }: { onBack: () => void }) {
  const [language, setLanguage] = useState<Member["language"] | null>(null)

  useEffect(() => {
    let active = true
    void memberApi.getCurrent().then((member) => {
      if (!active) return
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
      setLanguage(stored === "en" || stored === "zh" || stored === "es" ? stored : member.language)
    })
    return () => { active = false }
  }, [])

  async function choose(nextLanguage: Member["language"]) {
    setLanguage(nextLanguage)
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    await memberApi.setLanguage(nextLanguage)
  }

  return (
    <main className="figma-frame detail-frame-clean language-clean" data-figma-node="42:2731">
      <DetailHeader arrow={languageArrow} onBack={onBack} title="Language" />
      <fieldset aria-label="Language preference" className="detail-content-clean language-list-clean" disabled={language === null}>
        {languages.map((item) => (
          <label className="language-row-clean" key={item.value}>
            <span>{item.label}</span>
            <input
              aria-label={item.label}
              checked={language === item.value}
              name="language"
              onChange={() => void choose(item.value)}
              type="radio"
              value={item.value}
            />
            <span aria-hidden="true" className="language-check-clean" />
          </label>
        ))}
      </fieldset>
    </main>
  )
}
