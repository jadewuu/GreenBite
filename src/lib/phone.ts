export function digitsOnly(value: string) {
  return value.replace(/\D/g, "").slice(0, 10)
}

export function isUsPhoneNumber(value: string) {
  return /^\d{10}$/.test(value)
}

export function formatUsPhoneNumber(value: string) {
  const digits = digitsOnly(value)
  if (digits.length < 4) return digits
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}
