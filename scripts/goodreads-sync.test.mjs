import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import { parseReadEvents } from './goodreads-read-dates.mjs'
import {
  mergeBooksCsv,
  parseRss,
  replaceBookEvents,
} from './sync-goodreads-reading.mjs'

const fixturePath = (...parts) =>
  path.join(process.cwd(), 'scripts/fixtures', ...parts)

test('keeps Goodreads rereads and partial finish dates', () => {
  const html = fs.readFileSync(
    fixturePath('goodreads-review-edit', '35519109.html'),
    'utf8',
  )
  const events = parseReadEvents(html, {
    goodreadsId: '35519109',
    title: 'Exit Strategy',
    author: 'Martha Wells',
  })

  assert.equal(events.length, 2)
  assert.deepEqual(events[0].dateFinished, { year: 2008 })
  assert.deepEqual(events[1].dateStarted, {
    year: 2026,
    month: 6,
    day: 2,
  })
  assert.deepEqual(events[1].dateFinished, {
    year: 2026,
    month: 6,
    day: 16,
  })
  assert.deepEqual(
    events.map((event) => event.sessionIndex),
    [1, 2],
  )
})

test('parses the Goodreads RSS fields used by the incremental worker', () => {
  const rss = fs.readFileSync(fixturePath('goodreads-rss.xml'), 'utf8')
  const [book] = parseRss(rss)

  assert.equal(book.bookId, '35519109')
  assert.equal(book.status, 'read')
  assert.equal(book.dateRead, '2026/06/16')
  assert.equal(book.dateAdded, '2023/01/24')
  assert.equal(book.author, 'Martha Wells')
  assert.ok(book.fingerprint)
})

test('updates Goodreads fields without overwriting local review edits', () => {
  const csv = [
    'goodreads_id,title,author,isbn,isbn13,rating,status,date_read,date_added,favorite,review',
    '35519109,Exit Strategy,Martha Wells,,,3,currently-reading,,2023/01/24,true,Local review',
    '',
  ].join('\n')
  const [item] = parseRss(
    fs.readFileSync(fixturePath('goodreads-rss.xml'), 'utf8'),
  )
  const merged = mergeBooksCsv(csv, [item])

  assert.match(merged, /,4,read,2026\/06\/16,2023\/01\/24,true,Local review/)
})

test('replaces every stored session for a changed book atomically', () => {
  const existing = [
    { bookId: '1', sessionIndex: 1, dateFinished: { year: 2000 } },
    { bookId: '2', sessionIndex: 1, dateFinished: { year: 2001 } },
  ]
  const replacement = [
    { bookId: '1', sessionIndex: 1, dateFinished: { year: 2026 } },
  ]
  const events = replaceBookEvents(existing, '1', replacement)

  assert.deepEqual(
    events.map((event) => [event.bookId, event.dateFinished.year]),
    [
      ['2', 2001],
      ['1', 2026],
    ],
  )
})
