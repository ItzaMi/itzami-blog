import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import {
  booksFromCsv,
  parseReadEvents,
  reviewPageDiagnostic,
  normalizeCookie,
} from './goodreads-read-dates.mjs'
import {
  mergeBooksCsv,
  parseRss,
  replaceBookEvents,
  shouldSyncReadEvents,
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

test('reports safe review-page diagnostics without page contents', () => {
  const diagnostic = reviewPageDiagnostic(`
    <html>
      <head><title>Edit Review - Exit Strategy</title></head>
      <body><input name="review[date_read]" value="secret value" /></body>
    </html>
  `)

  assert.match(diagnostic, /Edit Review - Exit Strategy/)
  assert.match(diagnostic, /review\[date_read\]/)
  assert.doesNotMatch(diagnostic, /secret value/)
})

test('rejects malformed Goodreads Cookie headers safely', () => {
  assert.throws(
    () => normalizeCookie('Cookie: _session_id2=abc'),
    /without the "Cookie:" label/,
  )
  assert.throws(
    () => normalizeCookie('other=value'),
    /does not contain the Goodreads _session_id2/,
  )
  assert.equal(normalizeCookie('abc'), '_session_id2=abc')
  assert.equal(
    normalizeCookie('_session_id2=abc; other=value'),
    '_session_id2=abc; other=value',
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

test('does not replace stable metadata with empty Goodreads RSS values', () => {
  const csv = [
    'goodreads_id,title,author,isbn,isbn13,rating,status,date_read,date_added,favorite,review',
    '35519109,Exit Strategy,Martha Wells,,,4,read,2026/06/16,2023/01/24,false,Local review',
    '',
  ].join('\n')
  const [item] = parseRss(
    fs
      .readFileSync(fixturePath('goodreads-rss.xml'), 'utf8')
      .replace('<user_rating>4</user_rating>', '<user_rating>0</user_rating>')
      .replace(
        '<user_date_added>Thu, 24 Jan 2023 10:00:00 +0000</user_date_added>',
        '<user_date_added>Tue, 16 Jun 2026 10:00:00 +0000</user_date_added>',
      ),
  )
  const merged = mergeBooksCsv(csv, [item])

  assert.match(
    merged,
    /,4,read,2026\/06\/16,2023\/01\/24,false,Local review/,
  )
})

test('uses existing reading state when RSS omits the exclusive shelf', () => {
  const item = { status: '', dateRead: '' }

  assert.equal(shouldSyncReadEvents(item, { status: 'read' }), true)
  assert.equal(
    shouldSyncReadEvents(item, { status: 'currently-reading' }),
    true,
  )
  assert.equal(shouldSyncReadEvents(item, { status: 'to-read' }), false)
})

test('selects only known rereads for the historical backfill', () => {
  const books = booksFromCsv(
    path.join(process.cwd(), 'content/reading/goodreads_library_export.csv'),
    { rereadsOnly: true },
  )

  assert.equal(books.length, 8)
  assert.ok(books.every((book) => Number(book.exportedReadCount) > 1))
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
