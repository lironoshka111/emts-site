import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EMPTY, emailLooksValid, mailtoUrl, phoneLooksValid, validate } from './enquiry.ts'

const filled = { ...EMPTY, name: 'Dana', email: 'dana@example.com', interest: 'Need a 900 MHz repeater for a car park.' }

test('a complete enquiry has no errors', () => {
  assert.deepEqual(validate(filled), {})
})

test('name and email are required', () => {
  const e = validate(EMPTY)
  assert.ok(e.name && e.email && e.interest)
})

test('email must have an @ and a dotted domain', () => {
  for (const bad of ['dana', 'dana@', 'dana@example', 'da na@example.com', '@example.com'])
    assert.equal(emailLooksValid(bad), false, bad)
  for (const good of ['a@b.co', 'dana.k+rf@sub.example.co.il'])
    assert.equal(emailLooksValid(good), true, good)
})

test('phone is optional but must look like a number when given', () => {
  assert.equal(phoneLooksValid(''), true)
  assert.equal(phoneLooksValid('   '), true)
  assert.equal(phoneLooksValid('+972 54-123-4567'), true)
  assert.equal(phoneLooksValid('(03) 555 1234'), true)
  assert.equal(phoneLooksValid('12345'), false, 'too few digits')
  assert.equal(phoneLooksValid('1234567890123456'), false, 'too many digits')
  assert.equal(phoneLooksValid('call me'), false)
})

test('a one-word interest is rejected, a real sentence is not', () => {
  assert.ok(validate({ ...filled, interest: 'repeater' }).interest)
  assert.equal(validate({ ...filled, interest: 'TETRA 800 BDA for a tunnel' }).interest, undefined)
})

test('mailto carries the part number in the subject and the fields in the body', () => {
  const url = mailtoUrl('sales@emtstelecom.com', { ...filled, phone: '+972 3 555 1234' }, 'MR-450-20W70')
  assert.ok(url.startsWith('mailto:sales@emtstelecom.com?'))
  assert.ok(decodeURIComponent(url).includes('Quote request: MR-450-20W70'))
  assert.ok(decodeURIComponent(url).includes('Phone: +972 3 555 1234'))
})
