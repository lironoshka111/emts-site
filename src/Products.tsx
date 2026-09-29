import { useEffect, useMemo, useState } from 'react'
import { BY_SLUG, CATALOG, CATEGORIES, COUNTS, SLUG, TOTAL, docUrl, filterFamilies } from './catalog'
import { Card, PageHead, SALES } from './ui'

export default function Products({ slug }: { slug?: string }) {
  const category = (slug && BY_SLUG[slug]) || null
  const [q, setQ] = useState('')

  // A new category is a new browsing context; a stale query would hide everything.
  useEffect(() => setQ(''), [category])

  const shown = useMemo(() => {
    const cats = category ? [category] : CATEGORIES
    return cats.map((c) => [c, filterFamilies(CATALOG[c], q)] as const).filter(([, f]) => f.length > 0)
  }, [category, q])

  const hits = shown.reduce((n, [, fams]) => n + fams.reduce((m, f) => m + f.products.length, 0), 0)

  return (
    <>
      <PageHead
        kicker="Catalogue"
        title={category ?? 'All products'}
        lead={`${TOTAL} part numbers across six product lines, 150 MHz to 3500 MHz. Every part carries a datasheet.`}
      />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[250px_1fr]">
        {/* Category rail */}
        <nav aria-label="Product categories" className="lg:sticky lg:top-20 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            <RailItem href="#/products" active={!category} label="All products" count={TOTAL} />
            {CATEGORIES.map((c) => (
              <RailItem key={c} href={`#/products/${SLUG(c)}`} active={category === c} label={c} count={COUNTS[c]} />
            ))}
          </ul>
        </nav>

        <div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-tint/65">
              Search {category ?? 'the catalogue'}
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Part number, band or description — try 900, TETRA or HPR"
              className="w-full rounded-xl border border-tint/15 bg-tint/[0.04] px-4 py-3.5 text-[15px] outline-none transition placeholder:text-tint/65 focus:border-[var(--color-signal)]/60 focus:bg-tint/[0.07]"
            />
          </label>
          <p className="mt-2 font-mono text-xs text-tint/65" aria-live="polite">
            {hits} part{hits === 1 ? '' : 's'}
          </p>

          {shown.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-tint/15 px-6 py-16 text-center">
              <p className="font-semibold">Nothing matches “{q}”.</p>
              <p className="mt-1 text-sm text-tint/65">Try a band (900), a family (TETRA) or a part-number prefix (HPR).</p>
              <button onClick={() => setQ('')} className="mt-5 rounded-lg border border-tint/20 px-4 py-2 text-sm font-semibold transition hover:border-tint/50">
                Clear search
              </button>
            </div>
          ) : (
            <div className="mt-8 space-y-10">
              {shown.map(([cat, fams]) => (
                <section key={cat}>
                  {!category && (
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-tint/60">
                      <a href={`#/products/${SLUG(cat)}`} className="hover:text-[var(--color-signal)]">{cat} →</a>
                    </h2>
                  )}
                  <div className="space-y-5">
                    {fams.map((f) => (
                      <FamilyCard key={cat + f.family} f={f} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function RailItem({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <li>
      <a
        href={href}
        aria-current={active ? 'page' : undefined}
        className={`flex shrink-0 items-center justify-between gap-3 whitespace-nowrap rounded-lg border px-3 py-2.5 text-sm transition lg:whitespace-normal ${
          active
            ? 'border-[var(--color-signal)]/50 bg-[var(--color-signal)]/10 text-[var(--color-signal)]'
            : 'border-transparent text-tint/75 hover:bg-tint/5 hover:text-tint'
        }`}
      >
        <span className="font-medium">{label}</span>
        <span className="font-mono text-[11px] text-tint/60">{count}</span>
      </a>
    </li>
  )
}

function FamilyCard({ f }: { f: import('./catalog').Family }) {
  return (
    <Card className="overflow-hidden">
      <div className="grid gap-6 p-5 sm:grid-cols-[180px_1fr] sm:p-6">
        <div className="flex items-start">
          {f.image ? (
            <img
              src={f.image}
              alt={f.family}
              loading="lazy"
              className="h-32 w-full rounded-xl bg-white object-contain p-3 sm:h-36"
            />
          ) : (
            <div className="grid h-28 w-full place-items-center rounded-xl border border-dashed border-tint/15 text-xs text-tint/60">
              No photo
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-tight">{f.family}</h3>
          {f.bullets.length > 0 && (
            <ul className="mt-3 text-sm text-tint/75 md:columns-2 md:gap-8">
              {f.bullets.map((b) => (
                <li key={b} className="mb-1.5 flex break-inside-avoid gap-2">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--color-signal)]" />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ul className="divide-y divide-tint/[0.07] border-t border-tint/10">
        {f.products.map((p) => (
          <li key={p.sku} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 transition hover:bg-tint/[0.03] sm:px-6">
            <span className="font-mono text-sm font-semibold text-[var(--color-signal)]">{p.sku}</span>
            <span className="min-w-40 flex-1 text-sm text-tint/75">{p.name}</span>
            {/* 70 parts have no datasheet on the legacy host — no dead button for those. */}
            {p.doc && (
              <a
                href={docUrl(p.doc)}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-tint/15 px-2.5 py-1.5 text-xs font-semibold text-tint/75 transition hover:border-tint/45 hover:text-tint"
              >
                Datasheet {p.docKind}
              </a>
            )}
            <a
              href={`#/contact?prod=${encodeURIComponent(p.sku)}`}
              className="rounded-lg bg-tint/10 px-2.5 py-1.5 text-xs font-semibold transition hover:bg-[var(--color-signal)] hover:text-ink"
            >
              Request a quote
            </a>
          </li>
        ))}
      </ul>
      {f.products.length === 0 && <p className="px-6 pb-5 text-sm text-tint/60">Contact {SALES} for part numbers.</p>}
    </Card>
  )
}
