import { useEffect, useState } from "react"

import profileArrowLeft from "@/assets/figma/icon-arrow-left.svg"
import { memberApi } from "@/lib/api/member-api"
import type { Member, ProfileInput } from "@/lib/api/types"

type InformationPageProps = {
  step: "1" | "2"
  onBack: () => void
  onContinue: () => void
  onSaved: () => void
}

type FormErrors = Partial<Record<keyof ProfileInput, string>>

function validate(input: ProfileInput): FormErrors {
  const errors: FormErrors = {}

  if (!input.firstName.trim()) errors.firstName = "First name is required."
  if (!input.lastName.trim()) errors.lastName = "Last name is required."
  if (!input.birthday.trim()) errors.birthday = "Date of birth is required."
  if (!input.email.trim()) errors.email = "Email is required."
  else if (!/^\S+@\S+\.\S+$/.test(input.email)) errors.email = "Enter a valid email address."

  return errors
}

export function InformationPage({ onBack, onContinue, onSaved, step }: InformationPageProps) {
  const [member, setMember] = useState<Member | null>(null)
  const [form, setForm] = useState<ProfileInput | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true

    void memberApi.getCurrent().then((nextMember) => {
      if (!active) return
      setMember(nextMember)
      setForm({ firstName: nextMember.firstName, lastName: nextMember.lastName, birthday: nextMember.birthday, email: nextMember.email })
    })

    return () => { active = false }
  }, [])

  if (!member || !form) return <main aria-busy="true" className="detail-screen information-screen" />

  function updateField(field: keyof ProfileInput, value: string) {
    setForm((current) => current ? { ...current, [field]: value } : current)
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function continueToConfirmation() {
    if (!form) return

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onContinue()
  }

  async function saveInformation() {
    if (!form) return

    setSaving(true)
    await memberApi.updateProfile(form)
    onSaved()
  }

  const confirmation = step === "2"

  return (
    <main className="detail-screen information-screen figma-information-screen">
      <header className="detail-header figma-detail-header">
        <button aria-label="Back" onClick={onBack} type="button"><img alt="" src={profileArrowLeft} /></button>
        <h1 aria-label={confirmation ? "Confirm information" : "Information"}>Information</h1>
        <span aria-hidden="true" />
      </header>

      <section className="information-form" aria-label={confirmation ? "Confirm information" : "Complete information"}>
        <label className="profile-field">
          <span>Phone</span>
          <input aria-label="Phone" readOnly value="(408) 888-1234" />
        </label>
        <p className="information-intro">{confirmation ? "Please review personal information" : "Please complete personal information"}</p>
        <div className="profile-name-fields">
          <label className="profile-field">
            <span>Name</span>
            <input aria-invalid={Boolean(errors.firstName)} aria-label="First name" disabled={confirmation} onChange={(event) => updateField("firstName", event.target.value)} value={form.firstName} />
            {errors.firstName && <em>{errors.firstName}</em>}
          </label>
          <label className="profile-field profile-last-name">
            <span className="figma-hidden-label">Last name</span>
            <input aria-invalid={Boolean(errors.lastName)} aria-label="Last name" disabled={confirmation} onChange={(event) => updateField("lastName", event.target.value)} value={form.lastName} />
            {errors.lastName && <em>{errors.lastName}</em>}
          </label>
        </div>
        <label className="profile-field">
          <span>Date of Birth</span>
          <input aria-invalid={Boolean(errors.birthday)} aria-label="Date of birth" disabled={confirmation} onChange={(event) => updateField("birthday", event.target.value)} placeholder="Month Year" value={form.birthday} />
          {errors.birthday && <em>{errors.birthday}</em>}
        </label>
        <label className="profile-field">
          <span>Email</span>
          <input aria-invalid={Boolean(errors.email)} aria-label="Email" disabled={confirmation} onChange={(event) => updateField("email", event.target.value)} placeholder="Enter your email" type="email" value={form.email} />
          {errors.email && <em>{errors.email}</em>}
        </label>
        <label className="profile-marketing"><input defaultChecked type="checkbox" /> <span>Receive order updates and exclusive offers via SMS and email</span></label>
        {confirmation ? (
          <button className="information-submit" disabled={saving} onClick={() => void saveInformation()} type="button">Save information</button>
        ) : (
          <button className="information-submit" onClick={continueToConfirmation} type="button">Continue</button>
        )}
      </section>
    </main>
  )
}
