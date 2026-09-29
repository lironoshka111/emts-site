import { useEffect, useState } from 'react'
import Products from './Products'
import { CATALOG, CATEGORIES, COUNTS, SLUG, TOTAL } from './catalog'
import { Button, Card, CTA, MAIL, PageHead, SALES, SUPPORT, Section, stock } from './ui'

const HERO = stock('photo-1451187580459-43490279c0fa', 2000)
const BENCH = stock('photo-1563770660941-20978e870e26', 1200)
const PARTNER = stock('photo-1497366216548-37526070297c', 1200)

const NAV = [
  ['#/products', 'Products'],
  ['#/solutions', 'Solutions'],
  ['#/company', 'Company'],
  ['#/partners', 'Partners'],
  ['#/support', 'Support'],
] as const

const THEME_KEY = 'emts-theme'

function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY)
      if (saved === 'dark' || saved === 'light') return saved
    } catch {
      /* private mode / blocked storage — fall through to the OS preference */
    }
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* not fatal: the theme still applies for this visit */
    }
  }, [theme])
  return [theme, () => setTheme(theme === 'dark' ? 'light' : 'dark')] as const
}

function useHashRoute() {
  const read = () => window.location.hash.replace(/^#/, '') || '/'
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => {
      setRoute(read())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const [path, query = ''] = route.split('?')
  return { path: path.replace(/\/$/, '') || '/', params: new URLSearchParams(query) }
}

export default function App() {
  const { path, params } = useHashRoute()
  const seg = path.split('/').filter(Boolean)

  let page
  if (seg[0] === 'products') page = <Products slug={seg[1]} />
  else if (seg[0] === 'solutions') page = <Solutions />
  else if (seg[0] === 'company') page = <Company />
  else if (seg[0] === 'partners') page = <Partners />
  else if (seg[0] === 'support') page = <Support />
  else if (seg[0] === 'contact') page = <Contact prod={params.get('prod')} />
  else page = <Home />

  return (
    <div className="min-h-screen selection:bg-[var(--color-signal)] selection:text-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-lg focus:bg-[var(--color-signal)] focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <Header active={seg[0] ?? ''} />
      <main id="main">{page}</main>
      <Footer />
    </div>
  )
}

function Header({ active }: { active: string }) {
  const [open, setOpen] = useState(false)
  const [theme, toggleTheme] = useTheme()
  useEffect(() => setOpen(false), [active])
  return (
    <header className="sticky top-0 z-40 border-b border-tint/10 bg-page/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <a href="#/" className="flex items-center gap-2.5" aria-label="EMTS Telecom Services — home">
          <img src={`${import.meta.env.BASE_URL}emts-logo.png`} alt="EMTS Telecom Services" className="logo h-9 w-auto sm:h-11" width={591} height={267} />
        </a>

        <nav className="ms-auto hidden items-center gap-1 lg:flex">
          {NAV.map(([href, label]) => (
            <a
              key={href}
              href={href}
              aria-current={href === `#/${active}` ? 'page' : undefined}
              className={`rounded-lg px-3 py-2 text-sm transition hover:bg-tint/5 hover:text-tint ${
                href === `#/${active}` ? 'text-tint' : 'text-tint/75'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          className="ms-auto rounded-lg border border-tint/15 px-2.5 py-2 text-sm transition hover:border-tint/40 lg:ms-2"
        >
          <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
        </button>
        <a href="#/contact" className="rounded-lg bg-[var(--color-signal)] px-3.5 py-2 text-sm font-semibold text-ink transition hover:brightness-110 lg:ms-2">
          Contact
        </a>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="rounded-lg border border-tint/15 px-2.5 py-2 lg:hidden"
        >
          <span aria-hidden="true">{open ? '✕' : '☰'}</span>
        </button>
      </div>
      {open && (
        <nav className="border-t border-tint/10 px-4 py-2 lg:hidden">
          {NAV.map(([href, label]) => (
            <a key={href} href={href} className="block rounded-lg px-3 py-3 text-sm text-tint/75 hover:bg-tint/5">
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-tint/10">
        <img src={HERO} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-page/60 via-page/80 to-page" />
        <Wave />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-signal)]/30 bg-[var(--color-signal)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-signal)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]" />
            Turning technology into solutions
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Coverage where the network ends.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-tint/75">
            EMTS Telecom Services designs and manufactures high-end RF repeaters, fiber DAS, public-safety BDAs and
            low-PIM passives — 150 MHz to 3500 MHz, 2G through 5G.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="#/products">Browse {TOTAL} products</Button>
            <Button href="#/contact" tone="ghost">Talk to an RF engineer</Button>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-tint/10 bg-tint/10 lg:grid-cols-4">
            {[
              ['150–3500', 'MHz covered'],
              ['10–43', 'dBm output power'],
              ['2G–5G', 'technologies'],
              [String(TOTAL), 'catalogue parts'],
            ].map(([v, k]) => (
              <div key={k} className="bg-page/85 px-5 py-6">
                <dt className="font-mono text-2xl font-semibold text-[var(--color-signal)] sm:text-3xl">{v}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-tint/65">{k}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section title="Six product lines" lead="Every line is designed and manufactured in-house.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const cover = CATALOG[c].find((f) => f.image)?.image
            return (
              <a key={c} href={`#/products/${SLUG(c)}`} className="group">
                <Card className="h-full overflow-hidden transition group-hover:border-[var(--color-signal)]/40">
                  <div className="h-40 overflow-hidden bg-white p-4">
                    {cover && (
                      <img
                        src={cover}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-bold tracking-tight">{c}</h3>
                      <span className="font-mono text-xs text-tint/60">{COUNTS[c]}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-tint/65">
                      {CATALOG[c].slice(0, 3).map((f) => f.family).join(' · ')}
                    </p>
                  </div>
                </Card>
              </a>
            )
          })}
        </div>
      </Section>

      <Section title="What we solve" lead="Five ways we put signal into places that have none.">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.slice(0, 3).map(([t, b]) => (
            <Card key={t} className="p-6">
              <h3 className="text-lg font-bold tracking-tight">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-tint/75">{b}</p>
            </Card>
          ))}
        </div>
        <div className="mt-6"><Button href="#/solutions" tone="ghost">All five solutions</Button></div>
      </Section>

      <CTA />
    </>
  )
}

const SOLUTIONS: [string, string][] = [
  ['In-Building Solutions (IBS)', 'Wireless service inside a building is no longer a bonus, it is expected. EMTS systems deliver consistent coverage across buildings of any size.'],
  ['Passive DAS', 'Splitters, couplers and feeder built into one passive distribution network — the economical answer for a single operator with limited technologies.'],
  ['Hybrid DAS', 'Active and passive elements combined with fiber optic repeaters: a master unit and remote units supporting LTE, GSM and WCDMA.'],
  ['Repeaters & BDAs, indoor and outdoor', '450 MHz to 2600 MHz, 13 dBm to 43 dBm output, 60 dB to 95 dB gain, across cellular and public-safety networks.'],
  ['Interference cancellation', 'A multi-user technique that lowers the background noise floor, with advanced filtering and front-end design for in-band and out-of-band interference on 3G, 4G and 5G.'],
]

function Solutions() {
  return (
    <>
      <PageHead kicker="Solutions" title="Five ways we put signal into places that have none." lead="From a single passive run to a fiber DAS across a campus, plus the filtering that keeps it clean." />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {SOLUTIONS.map(([t, b], i) => (
            <Card key={t} className="p-6">
              <span className="font-mono text-xs text-[var(--color-signal)]">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="mt-2 text-xl font-bold tracking-tight">{t}</h2>
              <p className="mt-2 leading-relaxed text-tint/75">{b}</p>
            </Card>
          ))}
        </div>
      </Section>
      <CTA />
    </>
  )
}

function Company() {
  return (
    <>
      <PageHead kicker="Company" title="Built, not assembled." />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4 leading-relaxed text-tint/75">
            <p>
              EMTS Telecom Services Ltd. specializes in the design and manufacturing of high-end RF systems and modules:
              RF repeaters, fiber optic repeaters (DAS), MCPAs, boosters, LMR/PMR/DMR bi-directional amplifiers, TETRA
              repeaters and RF passive and active modules.
            </p>
            <p>
              We understand what wireless operators and service providers face today — accelerate deployment, lower cost,
              improve network performance. Our equipment covers 2G, 3G, 4G (LTE) and 5G co-location, coverage
              enhancement, capacity improvement, interference cancellation, spectrum re-farming and new technology
              introduction.
            </p>
            <dl className="mt-8 divide-y divide-tint/10 border-y border-tint/10">
              {[
                ['R&D and engineering in-house', 'Our own teams and designs, from concept to production unit.'],
                ['High-volume manufacturing', 'Cost-effective production for the parts that ship in quantity.'],
                ['Build to spec', 'A low-volume line for products tailored to a single network.'],
              ].map(([k, v]) => (
                <div key={k} className="py-4">
                  <dt className="font-semibold text-tint">{k}</dt>
                  <dd className="mt-0.5 text-sm text-tint/75">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <img src={BENCH} alt="Assembling an RF board at the bench" loading="lazy" className="aspect-4/3 w-full rounded-2xl border border-tint/10 object-cover opacity-85" />
        </div>
      </Section>
      <CTA />
    </>
  )
}

function Partners() {
  return (
    <>
      <PageHead kicker="Partners" title="Start a profitable business in in-building DAS and BDA solutions." />
      <Section>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ['Become a partner', 'EMTS sales partners are drawn from industry-leading companies with real expertise in cellular, TETRA and public-safety infrastructure.'],
              ['Contact a partner', 'A worldwide network of value-added resellers and local wireless specialists who can take a deployment from survey to sign-off.'],
            ].map(([h, b]) => (
              <Card key={h} className="p-6">
                <h2 className="text-lg font-bold tracking-tight">{h}</h2>
                <p className="mt-2 text-sm leading-relaxed text-tint/75">{b}</p>
                <a href={`mailto:${MAIL}?subject=${encodeURIComponent(h)}`} className="mt-4 inline-block text-sm font-semibold text-[var(--color-signal)] underline-offset-4 hover:underline">
                  {MAIL}
                </a>
              </Card>
            ))}
          </div>
          <img src={PARTNER} alt="A partner team at work" loading="lazy" className="hidden h-full w-full rounded-2xl border border-tint/10 object-cover opacity-70 lg:block" />
        </div>
      </Section>
      <CTA />
    </>
  )
}

function Support() {
  return (
    <>
      <PageHead kicker="Support" title="Technical support" lead="Our support team stays with you until the issue is resolved." />
      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['Start with the datasheet', 'Every part in the catalogue links its full specification. Most questions are answered there.', 'Open the catalogue', '#/products'],
            ['Documentation ships with the goods', 'Installation and technical documentation is included with the shipment for most products.', '', ''],
            ['Still stuck?', 'Send the part number, the site and what you are seeing. We answer with an engineer, not a ticket bot.', SUPPORT, `mailto:${SUPPORT}`],
          ].map(([h, b, link, href]) => (
            <Card key={h} className="p-6">
              <h2 className="font-bold tracking-tight">{h}</h2>
              <p className="mt-2 text-sm leading-relaxed text-tint/75">{b}</p>
              {link && (
                <a href={href} className="mt-4 inline-block text-sm font-semibold text-[var(--color-signal)] underline-offset-4 hover:underline">
                  {link}
                </a>
              )}
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}

function Contact({ prod }: { prod: string | null }) {
  return (
    <>
      <PageHead
        kicker="Contact"
        title={prod ? `Quote request — ${prod}` : 'Need more info on our RF coverage solutions?'}
        lead="Tell us the band, the building and the network. We answer with a configuration."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <EnquiryForm prod={prod} />
          <Card className="h-fit p-6">
            <h2 className="font-bold tracking-tight">Direct</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[['Sales', SALES], ['Support', SUPPORT], ['General', MAIL]].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-tint/65">{k}</dt>
                  <dd><a href={`mailto:${v}`} className="font-mono text-[var(--color-signal)] underline-offset-4 hover:underline">{v}</a></dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </Section>
    </>
  )
}

function EnquiryForm({ prod }: { prod: string | null }) {
  // No backend: the form composes a mailto, so nothing is silently dropped.
  const fields = [
    ['name', 'Name', 'text', true],
    ['company', 'Company', 'text', false],
    ['email', 'Email', 'email', true],
    ['country', 'Country', 'text', false],
  ] as const
  return (
    <form
      className="grid max-w-2xl gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault()
        const d = new FormData(e.currentTarget)
        const body = [...fields.map(([n, l]) => `${l}: ${d.get(n) ?? ''}`), `Interest: ${d.get('interest') ?? ''}`].join('\n')
        window.location.href = `mailto:${SALES}?subject=${encodeURIComponent(prod ? `Quote request: ${prod}` : 'Website enquiry')}&body=${encodeURIComponent(body)}`
      }}
    >
      {fields.map(([name, label, type, required]) => (
        <Field key={name} name={name} label={label} type={type} required={required} />
      ))}
      <div className="sm:col-span-2">
        <Field name="interest" label="What do you need?" textarea required defaultValue={prod ? `Please quote ${prod}.` : ''} />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" className="rounded-xl bg-[var(--color-signal)] px-5 py-3 text-sm font-bold text-ink transition hover:brightness-110">
          Send enquiry
        </button>
        <p className="text-xs text-tint/60">Opens your email client with the message ready — nothing is stored on this site.</p>
      </div>
    </form>
  )
}

function Field({ name, label, type = 'text', required, textarea, defaultValue }: { name: string; label: string; type?: string; required?: boolean; textarea?: boolean; defaultValue?: string }) {
  const cls = 'w-full rounded-xl border border-tint/15 bg-tint/[0.04] px-4 py-3 text-[15px] outline-none transition focus:border-[var(--color-signal)]/60 focus:bg-tint/[0.07]'
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-tint/65">
        {label}
        {required && <span className="text-[var(--color-signal)]"> *</span>}
      </span>
      {textarea ? (
        <textarea name={name} required={required} rows={4} defaultValue={defaultValue} className={cls} />
      ) : (
        <input name={name} type={type} required={required} defaultValue={defaultValue} className={cls} />
      )}
    </label>
  )
}

function Wave() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.18]" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 1200 400">
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M0 ${200 + i * 6} Q 150 ${120 - i * 18} 300 ${200 + i * 6} T 600 ${200 + i * 6} T 900 ${200 + i * 6} T 1200 ${200 + i * 6}`}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth={1}
          opacity={1 - i * 0.16}
        />
      ))}
    </svg>
  )
}

function Footer() {
  return (
    <footer className="border-t border-tint/10 px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">
        <div>
          <p className="font-bold">EMTS Telecom Services Ltd.</p>
          <p className="mt-1 text-sm text-tint/65">Turning technology into solutions.</p>
        </div>
        <nav aria-label="Products">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-tint/60">Products</p>
          <ul className="space-y-1.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c}><a href={`#/products/${SLUG(c)}`} className="text-tint/75 hover:text-tint">{c}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-tint/60">Contact</p>
          <ul className="space-y-1.5 font-mono text-sm">
            {[SALES, SUPPORT, MAIL].map((m) => (
              <li key={m}><a href={`mailto:${m}`} className="text-tint/75 hover:text-tint">{m}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl text-sm text-tint/60">
        © {new Date().getFullYear()} EMTS Telecom Services Ltd. All rights reserved.
      </p>
    </footer>
  )
}
