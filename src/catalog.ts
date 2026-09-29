import raw from './catalog.json'

export type { Prod, Family } from './filter'
export { filterFamilies } from './filter'
import type { Family } from './filter'

const BASE = import.meta.env.BASE_URL

// Product photos are stored with a root-absolute path; rebase them for Project Pages.
export const CATALOG: Record<string, Family[]> = Object.fromEntries(
  Object.entries(raw as Record<string, Family[]>).map(([cat, fams]) => [
    cat,
    fams.map((f) => (f.image ? { ...f, image: BASE + f.image.replace(/^\//, '') } : f)),
  ]),
)
export const CATEGORIES = Object.keys(CATALOG)

export const SLUG = (c: string) => c.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [SLUG(c), c]))

export const COUNTS = Object.fromEntries(
  CATEGORIES.map((c) => [c, CATALOG[c].reduce((n, f) => n + f.products.length, 0)]),
)
export const TOTAL = Object.values(COUNTS).reduce((a, b) => a + b, 0)

/** Not every part has a datasheet — 70 of the legacy host's links are broken at source. */
export const WITH_DOCS = CATEGORIES.reduce(
  (n, c) => n + CATALOG[c].reduce((m, f) => m + f.products.filter((p) => p.doc).length, 0),
  0,
)

/** Datasheets still live on the legacy host; paths are already URL-encoded. */
export const docUrl = (p: string) => `https://emtstelecom.com${p}`
