export type Enquiry = {
  name: string
  company: string
  email: string
  phone: string
  country: string
  interest: string
}

export const EMPTY: Enquiry = { name: '', company: '', email: '', phone: '', country: '', interest: '' }

/** Deliberately permissive: one @, a dot in the domain, no spaces. Real validation is the reply. */
export function emailLooksValid(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
}

/** Accepts international formats: +, spaces, dashes, parens, 7-15 digits. Optional field. */
export function phoneLooksValid(v: string) {
  const digits = v.replace(/\D/g, '')
  return v.trim() === '' || (/^[+(\d][\d\s().-]*$/.test(v.trim()) && digits.length >= 7 && digits.length <= 15)
}

export function validate(e: Enquiry): Partial<Record<keyof Enquiry, string>> {
  const errs: Partial<Record<keyof Enquiry, string>> = {}
  if (!e.name.trim()) errs.name = 'We need a name to reply to.'
  if (!e.email.trim()) errs.email = 'We need an email to send the answer to.'
  else if (!emailLooksValid(e.email)) errs.email = 'That address is missing an @ or a domain.'
  if (!phoneLooksValid(e.phone)) errs.phone = 'That does not look like a phone number.'
  if (e.interest.trim().length < 10) errs.interest = 'A sentence or two helps us quote the right part.'
  return errs
}

export function mailtoUrl(to: string, e: Enquiry, product: string | null) {
  const body = [
    `Name: ${e.name}`,
    `Company: ${e.company}`,
    `Email: ${e.email}`,
    `Phone: ${e.phone}`,
    `Country: ${e.country}`,
    '',
    e.interest,
  ].join('\n')
  const subject = product ? `Quote request: ${product}` : 'Website enquiry'
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
