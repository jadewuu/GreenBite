import { useEffect, useState } from "react"

import calendarIcon from "@/assets/figma-clean/details/calendar.svg"
import checkIcon from "@/assets/figma-clean/details/check.svg"
import clearIcon from "@/assets/figma-clean/details/circle-x.svg"
import informationCompleteArrow from "@/assets/figma-clean/details/information-complete-arrow-left.svg"
import informationArrow from "@/assets/figma-clean/details/information-arrow-left.svg"
import phoneIcon from "@/assets/figma-clean/details/phone.svg"
import { memberApi } from "@/lib/api/member-api"
import type { Member, ProfileInput } from "@/lib/api/types"

import { DetailHeader } from "./detail-header"
import { useLockedViewportHeight } from "../use-locked-viewport-height"

export type InformationDraft = ProfileInput & { marketing: boolean }

type InformationProps = {
  draft?: InformationDraft
  onBack: (draft: InformationDraft) => void
  onSaved: () => void
  step: "1" | "2"
}

const completeDraft: InformationDraft = {
  firstName: "John",
  lastName: "H",
  birthday: "June 2020",
  email: "john.h@mail.com",
  marketing: true,
}

const dateLocales: Record<Member["language"], string> = { en: "en-US", es: "es-ES", zh: "zh-CN" }

function monthNames(language: Member["language"]) {
  return Array.from({ length: 12 }, (_, index) => new Intl.DateTimeFormat(dateLocales[language], { month: "long" }).format(new Date(2000, index, 1)))
}

function toMonthValue(birthday: string) {
  if (/^\d{4}-\d{2}/.test(birthday)) return birthday.slice(0, 7)
  const chineseMatch = birthday.match(/^(\d{4})年(\d{1,2})月$/)
  if (chineseMatch) return `${chineseMatch[1]}-${chineseMatch[2].padStart(2, "0")}`
  const year = birthday.match(/\d{4}/)?.[0]
  if (!year) return ""
  const normalized = birthday.toLocaleLowerCase().replace(/\s/g, "")
  const monthIndex = (["en", "es", "zh"] as const).flatMap((language) => monthNames(language)).findIndex((month) => normalized.includes(month.toLocaleLowerCase().replace(/\s/g, "")))
  return monthIndex < 0 ? "" : `${year}-${String((monthIndex % 12) + 1).padStart(2, "0")}`
}

function toBirthdayLabel(monthValue: string, language: Member["language"]) {
  const [year, month] = monthValue.split("-").map(Number)
  if (!year || !month) return ""
  return new Intl.DateTimeFormat(dateLocales[language], { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1))
}

export function Information({ draft, onBack, onSaved, step }: InformationProps) {
  const frameRef = useLockedViewportHeight<HTMLElement>()
  const [member, setMember] = useState<Member | null>(null)
  const [form, setForm] = useState<InformationDraft | null>(null)
  const [focusedField, setFocusedField] = useState<"firstName" | null>(null)
  const [showValidation, setShowValidation] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    void memberApi.getCurrent().then((nextMember) => {
      if (!active) return
      setMember(nextMember)
      const nextForm = draft ? { ...draft, birthday: toMonthValue(draft.birthday) } : step === "2" ? { ...completeDraft, birthday: toMonthValue(completeDraft.birthday) } : { firstName: nextMember.firstName, lastName: nextMember.lastName.charAt(0), birthday: "", email: "", marketing: false }
      setForm(nextForm)
    })
    return () => { active = false }
  }, [draft, step])

  if (!member || !form) return <main ref={frameRef} aria-busy="true" className="figma-frame detail-frame-clean" />

  const language = member.language
  const valid = Boolean(form.firstName.trim() && form.lastName.trim() && toMonthValue(form.birthday) && (!form.email || /^\S+@\S+\.\S+$/.test(form.email)))

  function update<K extends keyof InformationDraft>(field: K, value: InformationDraft[K]) {
    setForm((current) => current ? { ...current, [field]: value } : current)
  }

  async function submit() {
    const submitted = form
    if (!submitted || saving) return
    if (!valid) {
      setShowValidation(true)
      return
    }
    setSaving(true)
    await memberApi.updateProfile({ firstName: submitted.firstName, lastName: submitted.lastName, birthday: toBirthdayLabel(submitted.birthday, language), email: submitted.email })
    onSaved()
  }

  function updateBirthday(value: string) {
    update("birthday", value)
  }

  return (
    <main ref={frameRef} className="figma-frame detail-frame-clean information-clean" data-figma-node={step === "1" ? "42:1110" : "42:1466"}>
      <DetailHeader arrow={step === "1" ? informationArrow : informationCompleteArrow} onBack={() => onBack(form)} title="Information" />
      <form className="detail-content-clean information-form-clean" onSubmit={(event) => { event.preventDefault(); void submit() }}>
        <label className="information-field-clean is-phone">
          <span>Phone</span>
          <span className="information-input-shell-clean"><img alt="Phone" data-testid="phone-icon" src={phoneIcon} /><input aria-label="Phone" readOnly value="(408) 888-1234" /></span>
        </label>
        <p className="information-intro-clean">Please complete personal information</p>
        <div className="information-name-clean">
          <label className="information-field-clean">
            <span>Name</span>
            <span className="information-input-shell-clean"><input aria-label="First name" autoFocus={step === "1"} onBlur={() => setFocusedField(null)} onChange={(event) => update("firstName", event.target.value)} onFocus={() => setFocusedField("firstName")} value={form.firstName} />{focusedField === "firstName" && form.firstName && <button aria-label="Clear first name" onClick={() => update("firstName", "")} onMouseDown={(event) => event.preventDefault()} type="button"><img alt="" src={clearIcon} /></button>}</span>
          </label>
          <label className="information-field-clean">
            <span aria-hidden="true">&nbsp;</span>
            <span className="information-input-shell-clean"><input aria-label="Last name" onChange={(event) => update("lastName", event.target.value)} value={form.lastName} /></span>
          </label>
        </div>
        <label className="information-field-clean information-date-field-clean">
          <span>Date of Birth</span>
          <span className="information-input-shell-clean"><input aria-label="Date of birth" lang={dateLocales[language]} onChange={(event) => updateBirthday(event.target.value)} type="month" value={toMonthValue(form.birthday)} /><img alt="Calendar" data-testid="calendar-icon" src={calendarIcon} /></span>
        </label>
        <label className="information-field-clean">
          <span>Email (optional)</span>
          <span className="information-input-shell-clean"><input aria-label="Email" onChange={(event) => update("email", event.target.value)} placeholder="Enter your email" type="email" value={form.email} /></span>
        </label>
        <label className="information-marketing-clean">
          <input aria-label="Receive order updates and exclusive offers via SMS and email" checked={form.marketing} onChange={(event) => update("marketing", event.target.checked)} type="checkbox" />
          <span aria-hidden="true" className="information-checkbox-clean">{form.marketing && <img alt="" src={checkIcon} />}</span>
          <span>Receive order updates and exclusive offers via SMS and email</span>
        </label>
        {showValidation && !valid && <p className="information-validation-clean" role="alert">Enter your name, date of birth, and a valid email if provided.</p>}
        <button className="information-submit-clean" disabled={saving} type="submit">Submit</button>
      </form>
    </main>
  )
}
