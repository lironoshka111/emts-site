export type Prod = { sku: string; name: string; doc: string | null; docKind: 'PDF' | 'DOC' | null }
export type Family = { family: string; image: string | null; bullets: string[]; products: Prod[] }

/** Keep a family if its name matches; otherwise keep only the products that match. */
export function filterFamilies(families: Family[], q: string): Family[] {
  const n = q.trim().toLowerCase()
  if (!n) return families
  return families
    .map((f) => {
      if (f.family.toLowerCase().includes(n)) return f
      const hits = f.products.filter(
        (p) => p.sku.toLowerCase().includes(n) || p.name.toLowerCase().includes(n),
      )
      return hits.length ? { ...f, products: hits } : null
    })
    .filter((f): f is Family => f !== null)
}
