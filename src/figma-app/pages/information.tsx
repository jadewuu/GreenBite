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

export type InformationDraft = ProfileInput & { marketing: boolean }

type InformationProps = {
  draft?: InformationDraft
  onBack: (draft: InformationDraft) => void
  onContinue: (draft: InformationDraft) => void
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

export function Information({ draft, onBack, onContinue, onSaved, step }: InformationProps) {
  const [member, setMember] = useState<Member | null>(null)
  const [form, setForm] = useState<InformationDraft | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    void memberApi.getCurrent().then((nextMember) => {
      if (!active) return
      setMember(nextMember)
      if (draft) setForm(draft)
      else if (step === "2") setForm(completeDraft)
      else setForm({ firstName: nextMember.firstName, lastName: nextMember.lastName.charAt(0), birthday: "", email: "", marketing: false })
    })
    return () => { active = false }
  }, [draft, step])

  if (!member || !form) return <main aria-busy="true" className="figma-frame detail-frame-clean" />

  const valid = Boolean(form.firstName.trim() && form.lastName.trim() && form.birthday.trim() && /^\S+@\S+\.\S+$/.test(form.email) && form.marketing)

  function update<K extends keyof InformationDraft>(field: K, value: InformationDraft[K]) {
    setForm((current) => current ? { ...current, [field]: value } : current)
  }

  async function submit() {
    const submitted = form
    if (!submitted || !valid || saving) return
    if (step === "1") {
      onContinue(submitted)
      return
    }
    setSaving(true)
    await memberApi.updateProfile({ firstName: submitted.firstName, lastName: submitted.lastName, birthday: submitted.birthday, email: submitted.email })
    onSaved()
  }

  return (
    <main className="figma-frame detail-frame-clean information-clean" data-figma-node={step === "1" ? "42:1110" : "42:1466"}>
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
            <span className="information-input-shell-clean"><input aria-label="First name" autoFocus={step === "1"} onChange={(event) => update("firstName", event.target.value)} value={form.firstName} />{step === "1" && form.firstName && <button aria-label="Clear first name" onClick={() => update("firstName", "")} type="button"><img alt="" src={clearIcon} /></button>}</span>
          </label>
          <label className="information-field-clean">
            <span aria-hidden="true">&nbsp;</span>
            <span className="information-input-shell-clean"><input aria-label="Last name" onChange={(event) => update("lastName", event.target.value)} value={form.lastName} /></span>
          </label>
        </div>
        <label className="information-field-clean">
          <span>Date of Birth</span>
          <span className="information-input-shell-clean"><input aria-label="Date of birth" onChange={(event) => update("birthday", event.target.value)} placeholder="Month Year" value={form.birthday} /><img alt="Calendar" data-testid="calendar-icon" src={calendarIcon} /></span>
        </label>
        <label className="information-field-clean">
          <span>Email</span>
          <span className="information-input-shell-clean"><input aria-label="Email" onChange={(event) => update("email", event.target.value)} placeholder="Enter your email" type="email" value={form.email} /></span>
        </label>
        <label className="information-marketing-clean">
          <input aria-label="Receive order updates and exclusive offers via SMS and email" checked={form.marketing} onChange={(event) => update("marketing", event.target.checked)} type="checkbox" />
          <span aria-hidden="true" className="information-checkbox-clean">{form.marketing && <img alt="" src={checkIcon} />}</span>
          <span>Receive order updates and exclusive offers via SMS and email</span>
        </label>
        <button className="information-submit-clean" disabled={!valid || saving} type="submit">Submit</button>
      </form>
    </main>
  )
}
