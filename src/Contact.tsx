import { useState } from 'react'
import { EMPTY, type Enquiry, mailtoUrl, validate } from './enquiry'
import { Card, MAIL, PageHead, SALES, SUPPORT, Section } from './ui'

// Set VITE_FORM_ENDPOINT to a real form service and the enquiry is captured there.
// Until then it composes a mailto, which is honest but loses anyone without a mail client.
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined

type Errors = Partial<Record<keyof Enquiry, string>>

export default function Contact({ prod }: { prod: string | null }) {
  const [form, setForm] = useState<Enquiry>(() => ({
    ...EMPTY,
    interest: prod ? `Please quote ${prod}. ` : '',
  }))
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'mail'>('idle')

  const set = (k: keyof Enquiry) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    // clear the error the moment they start fixing it, don't wait for the next blur
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e))
  }
  const blur =
    (k: keyof Enquiry) =>
    (ev: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const all = validate({ ...form, [k]: ev.target.value })
      setErrors((e) => ({ ...e, [k]: all[k] }))
    }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    const found = validate(form)
    setErrors(found)
    const firstBad = (Object.keys(found) as (keyof Enquiry)[])[0]
    if (firstBad) {
      document.getElementById(`f-${firstBad}`)?.focus()
      return
    }
    if (!ENDPOINT) {
      window.location.href = mailtoUrl(SALES, form, prod)
      setState('mail')
      return
    }
    setState('sending')
    try {
      const r = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, product: prod ?? '' }),
      })
      if (!r.ok) throw new Error(String(r.status))
      setState('sent')
    } catch {
      // never strand the enquiry: fall back to the mail client
      window.location.href = mailtoUrl(SALES, form, prod)
      setState('mail')
    }
  }

  return (
    <>
      <PageHead
        kicker="Contact"
        title={prod ? `Quote request — ${prod}` : 'Talk to an RF engineer'}
        lead="Tell us the band, the building and the network. We answer with a configuration, not a brochure."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          {state === 'sent' ? (
            <Sent onAgain={() => { setForm({ ...EMPTY }); setState('idle') }} />
          ) : (
            <form onSubmit={submit} noValidate className="grid max-w-2xl gap-5 sm:grid-cols-2">
              <Field id="name" label="Name" value={form.name} onChange={set('name')} onBlur={blur('name')} error={errors.name} required autoComplete="name" />
              <Field id="company" label="Company" value={form.company} onChange={set('company')} onBlur={blur('company')} error={errors.company} autoComplete="organization" />
              <Field id="email" label="Email" type="email" value={form.email} onChange={set('email')} onBlur={blur('email')} error={errors.email} required autoComplete="email" />
              <Field id="phone" label="Phone" type="tel" hint="Optional" value={form.phone} onChange={set('phone')} onBlur={blur('phone')} error={errors.phone} autoComplete="tel" />
              <div className="sm:col-span-2">
                <Field id="country" label="Country" value={form.country} onChange={set('country')} onBlur={blur('country')} error={errors.country} autoComplete="country-name" />
              </div>
              <div className="sm:col-span-2">
                <Field
                  id="interest" label="What do you need?" textarea
                  hint="Band, output power, building or site, and the network — cellular, TETRA, public safety, GSM-R."
                  value={form.interest} onChange={set('interest')} onBlur={blur('interest')} error={errors.interest} required
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                <button
                  type="submit"
                  disabled={state === 'sending'}
                  className="rounded-xl bg-[var(--color-signal)] px-6 py-3.5 text-sm font-bold text-ink transition hover:brightness-110 disabled:opacity-60"
                >
                  {state === 'sending' ? 'Sending…' : 'Send enquiry'}
                </button>
                {state === 'mail' && (
                  <p className="text-xs text-tint/65" role="status">
                    Your email client should have opened with the message ready to send.
                  </p>
                )}
                {!ENDPOINT && state !== 'mail' && (
                  <p className="text-xs text-tint/65">Opens your email client with everything filled in.</p>
                )}
              </div>
            </form>
          )}

          <aside className="space-y-5">
            <Card className="p-6">
              <h2 className="font-bold tracking-tight">Email us directly</h2>
              <dl className="mt-4 space-y-3.5 text-sm">
                {[
                  ['Sales and quotes', SALES],
                  ['Technical support', SUPPORT],
                  ['Everything else', MAIL],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-tint/65">{k}</dt>
                    <dd>
                      <a href={`mailto:${v}`} className="font-mono text-[var(--color-signal)] underline-offset-4 hover:underline">{v}</a>
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>

            <Card className="p-6">
              <h2 className="font-bold tracking-tight">What gets you a faster answer</h2>
              <ul className="mt-3 space-y-2 text-sm text-tint/75">
                {[
                  'The frequency band, and the standard on it',
                  'Output power and gain you are aiming for',
                  'Indoor, outdoor, tunnel or rolling stock',
                  'How many units, and where they ship',
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--color-signal)]" />
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  )
}

function Sent({ onAgain }: { onAgain: () => void }) {
  return (
    <Card className="max-w-2xl p-8" >
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-signal)] text-lg text-ink">✓</span>
        <div>
          <h2 className="text-xl font-bold tracking-tight" role="status">Enquiry sent.</h2>
          <p className="mt-2 text-tint/75">
            It is with the sales team. If you need to add anything, reply to the confirmation or write to{' '}
            <a href={`mailto:${SALES}`} className="font-mono text-[var(--color-signal)] underline-offset-4 hover:underline">{SALES}</a>.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#/products" className="rounded-xl bg-[var(--color-signal)] px-5 py-3 text-sm font-bold text-ink transition hover:brightness-110">Back to the catalogue</a>
            <button onClick={onAgain} className="rounded-xl border border-tint/20 px-5 py-3 text-sm font-semibold transition hover:border-tint/50">Send another</button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function Field({
  id, label, value, onChange, onBlur, error, required, textarea, type = 'text', hint, autoComplete,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void
  onBlur: (ev: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string; required?: boolean; textarea?: boolean; type?: string; hint?: string; autoComplete?: string
}) {
  const cls = `w-full rounded-xl border bg-tint/[0.04] px-4 py-3 text-[15px] outline-none transition ${
    error ? 'border-red-400/70 focus:border-red-400' : 'border-tint/15 focus:border-[var(--color-signal)] focus:bg-tint/[0.07]'
  }`
  return (
    <div>
      <label htmlFor={`f-${id}`} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-tint/65">
        {label}
        {required ? <span className="text-[var(--color-signal)]"> *</span> : hint === 'Optional' ? <span className="ms-1.5 normal-case tracking-normal text-tint/60">optional</span> : null}
      </label>
      {textarea ? (
        <textarea id={`f-${id}`} rows={5} className={cls} value={value} required={required}
          aria-invalid={!!error} aria-describedby={error ? `e-${id}` : hint && hint !== 'Optional' ? `h-${id}` : undefined}
          onChange={(e) => onChange(e.target.value)} onBlur={onBlur} />
      ) : (
        <input id={`f-${id}`} type={type} className={cls} value={value} required={required} autoComplete={autoComplete}
          aria-invalid={!!error} aria-describedby={error ? `e-${id}` : hint && hint !== 'Optional' ? `h-${id}` : undefined}
          onChange={(e) => onChange(e.target.value)} onBlur={onBlur} />
      )}
      {error ? (
        <p id={`e-${id}`} role="alert" className="mt-1.5 text-xs text-red-300">{error}</p>
      ) : hint && hint !== 'Optional' ? (
        <p id={`h-${id}`} className="mt-1.5 text-xs text-tint/60">{hint}</p>
      ) : null}
    </div>
  )
}
