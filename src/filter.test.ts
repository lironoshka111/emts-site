import { test } from 'node:test'
import assert from 'node:assert/strict'
import { filterFamilies, type Family } from './filter.ts'

const fams: Family[] = [
  { family: '450MHz Repeaters', image: null, bullets: [], products: [
    { sku: 'MR-450-20W70', name: '450 MHz 20dBm WCDMA Mini Repeater', pdf: null },
    { sku: 'HPR-45-40W95', name: '450 MHz 40dBm WCDMA High Power Repeater', pdf: null },
  ] },
  { family: 'TETRA 800 MHz BDAs', image: null, bullets: [], products: [
    { sku: 'MR-800T-20W75', name: 'TETRA 800 MHz 20dBm mini Repeater BDA', pdf: null },
  ] },
]

test('empty query returns everything untouched', () => {
  assert.equal(filterFamilies(fams, '   ').length, 2)
})

test('a family-name match keeps all of its products', () => {
  const r = filterFamilies(fams, 'tetra')
  assert.equal(r.length, 1)
  assert.equal(r[0].products.length, 1)
})

test('a part-number match narrows the family to the matching parts', () => {
  const r = filterFamilies(fams, 'hpr')
  assert.equal(r.length, 1)
  assert.deepEqual(r.map((f) => f.products.map((p) => p.sku)), [['HPR-45-40W95']])
})

test('search is case-insensitive and matches descriptions', () => {
  assert.equal(filterFamilies(fams, 'WCDMA')[0].products.length, 2)
})

test('no match returns an empty list, not everything', () => {
  assert.deepEqual(filterFamilies(fams, 'zzz'), [])
})
