# EMTS Telecom — site

Rebuild of emtstelecom.com. Vite + React + TypeScript + Tailwind v4, no backend.

- `src/catalog.json` — 224 part numbers in 59 families, scraped from the legacy site
  (spec bullets, product photos, datasheet links). Datasheets are served from
  emtstelecom.com; the 70 parts whose link is broken there render no button.
- `public/products/` — 52 product photos.
- Routing is hash-based, so GitHub Pages needs no rewrite rules.
- Enquiry forms compose a `mailto:` — there is no server.

```bash
npm install
npm run dev
npm test          # catalogue search logic
npm run build     # BASE=/ npm run build for a custom domain
```
