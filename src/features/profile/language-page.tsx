import { useEffect, useState } from "react"

import profileArrowLeft from "@/assets/figma/icon-arrow-left.svg"
import { memberApi } from "@/lib/api/member-api"
import type { Member } from "@/lib/api/types"

type LanguagePageProps = {
  onBack: () => void
}

const languages: Array<{ label: string; value: Member["language"] }> = [
  { label: "English", value: "en" },
  { label: "Chinese (Mainland)", value: "zh" },
  { label: "Spanish", value: "es" },
]

export function LanguagePage({ onBack }: LanguagePageProps) {
  const [language, setLanguage] = useState<Member["language"] | null>(null)

  useEffect(() => {
    let active = true

    void memberApi.getCurrent().then((member) => {
      if (active) setLanguage(member.language)
    })

    return () => { active = false }
  }, [])

  async function selectLanguage(value: Member["language"]) {
    setLanguage(value)
    await memberApi.setLanguage(value)
  }

  return (
    <main className="detail-screen language-screen figma-language-screen">
      <header className="detail-header figma-detail-header">
        <button aria-label="Back" onClick={onBack} type="button"><img alt="" src={profileArrowLeft} /></button>
        <h1>Language</h1>
        <span aria-hidden="true" />
      </header>

      <fieldset className="language-list" disabled={!language}>
        <legend className="sr-only">Language preference</legend>
        {languages.map((item) => (
          <label className="language-option" key={item.value}>
            <span>{item.label}</span>
            <input aria-label={item.label} checked={language === item.value} name="language" onChange={() => void selectLanguage(item.value)} type="radio" value={item.value} />
            <span aria-hidden="true" className="language-check">✓</span>
          </label>
        ))}
      </fieldset>
    </main>
  )
}
