import type { ReactNode } from 'react'

export const MAIL = 'info@emtstelecom.com'
export const SALES = 'sales@emtstelecom.com'
export const SUPPORT = 'support@emtstelecom.com'

export const stock = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`

export function Button({ href, children, tone = 'solid' }: { href: string; children: ReactNode; tone?: 'solid' | 'ghost' }) {
  return (
    <a
      href={href}
      className={
        tone === 'solid'
          ? 'inline-block rounded-xl bg-[var(--color-signal)] px-5 py-3 text-sm font-bold text-ink transition hover:brightness-110'
          : 'inline-block rounded-xl border border-tint/20 px-5 py-3 text-sm font-semibold text-tint/85 transition hover:border-tint/50'
      }
    >
      {children}
    </a>
  )
}

export function PageHead({ kicker, title, lead }: { kicker?: string; title: string; lead?: string }) {
  return (
    <header className="border-b border-tint/10 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        {kicker && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-signal)]">{kicker}</p>}
        <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-tint/75">{lead}</p>}
      </div>
    </header>
  )
}

export function Section({ title, lead, children }: { title?: string; lead?: string; children: ReactNode }) {
  return (
    <section className="border-b border-tint/10 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        {title && <h2 className="max-w-3xl text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>}
        {lead && <p className="mt-3 max-w-2xl text-tint/75">{lead}</p>}
        <div className={title ? 'mt-9' : ''}>{children}</div>
      </div>
    </section>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-tint/10 bg-tint/[0.03] ${className}`}>{children}</div>
}

export function CTA() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl rounded-2xl border border-[var(--color-signal)]/25 bg-gradient-to-br from-[var(--color-signal)]/10 to-transparent p-8 sm:p-12">
        <h2 className="max-w-2xl text-2xl font-extrabold tracking-tight sm:text-3xl">Tell us the band, the building and the network.</h2>
        <p className="mt-3 max-w-xl text-tint/75">We answer with a configuration, not a brochure.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="#/contact">Request a quote</Button>
          <Button href={`mailto:${SALES}`} tone="ghost">{SALES}</Button>
        </div>
      </div>
    </section>
  )
}
