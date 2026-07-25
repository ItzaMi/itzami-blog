import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  fetchGoodreads,
  parseReadEvents,
  readDateSortValue,
} from './goodreads-read-dates.mjs'

const ROOT = process.cwd()
const BOOKS_PATH = path.join(ROOT, 'content/reading/books.csv')
const EVENTS_PATH = path.join(
  ROOT,
  'content/reading/imports/goodreads-read-events.json',
)
const STATE_PATH = path.join(
  ROOT,
  'content/reading/imports/goodreads-sync-state.json',
)
const HEARTBEAT_DAYS = 45
const BOOK_HEADERS = [
  'goodreads_id',
  'title',
  'author',
  'isbn',
  'isbn13',
  'rating',
  'status',
  'date_read',
  'date_added',
  'favorite',
  'review',
]

function parseArgs(argv) {
  const args = {
    bookIds: [],
    force: false,
    dryRun: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    const next = argv[index + 1]

    if (arg === '--rss-file') {
      args.rssFile = next
      index += 1
    } else if (arg === '--html-dir') {
      args.htmlDir = next
      index += 1
    } else if (arg === '--book-id') {
      args.bookIds.push(next)
      index += 1
    } else if (arg === '--force') {
      args.force = true
    } else if (arg === '--dry-run') {
      args.dryRun = true
    } else if (arg === '--help' || arg === '-h') {
      args.help = true
    } else {
      throw new Error(`Unknown argument: ${arg}`)
    }
  }

  return args
}

function usage() {
  return `
Usage:
  GOODREADS_RSS_URL='...' GOODREADS_COOKIE='...' npm run reading:sync
  npm run reading:sync -- --rss-file feed.xml --html-dir review-pages

Options:
  --rss-file <path>   Read a saved Goodreads RSS feed instead of fetching it
  --html-dir <path>   Read <book-id>.html fixtures instead of fetching edit pages
  --book-id <id>      Sync only one feed item, repeatable
  --force             Reprocess matching feed items even when unchanged
  --dry-run           Report changes without writing files
`.trim()
}

function stripCdata(value) {
  return value
    .replace(/^<!\[CDATA\[/, '')
    .replace(/\]\]>$/, '')
    .trim()
}

function decodeXml(value) {
  return stripCdata(value)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .trim()
}

function tagValue(xml, name) {
  const match = xml.match(
    new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'),
  )

  return match ? decodeXml(match[1]) : ''
}

function cleanText(value) {
  return value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function normalizeIsbn(value) {
  return value.replace(/[="]/g, '').trim()
}

function parseShelfNames(value) {
  return value
    .split(',')
    .map((shelf) => shelf.trim().toLowerCase())
    .filter(Boolean)
}

function getStatus(shelves) {
  if (shelves.includes('currently-reading')) {
    return 'currently-reading'
  }

  if (shelves.includes('read')) {
    return 'read'
  }

  if (shelves.includes('did-not-finish') || shelves.includes('dnf')) {
    return 'did-not-finish'
  }

  if (shelves.includes('to-read')) {
    return 'to-read'
  }

  return ''
}

const MONTHS = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
}

function rssDateToCsv(value) {
  if (!value) {
    return ''
  }

  const match = value.match(/\b(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\b/)
  if (!match) {
    return ''
  }

  const month = MONTHS[match[2].toLowerCase()]
  if (!month) {
    return ''
  }

  return [
    match[3],
    String(month).padStart(2, '0'),
    String(Number(match[1])).padStart(2, '0'),
  ].join('/')
}

function parseRss(xml) {
  const items = []
  const itemPattern = /<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi
  let match

  while ((match = itemPattern.exec(xml))) {
    const raw = match[0]
    const body = match[1]
    const bookId = tagValue(body, 'book_id')

    if (!bookId) {
      continue
    }

    const shelves = parseShelfNames(tagValue(body, 'user_shelves'))
    items.push({
      bookId,
      title: cleanText(tagValue(body, 'title')),
      author: cleanText(tagValue(body, 'author_name')),
      isbn: normalizeIsbn(tagValue(body, 'isbn')),
      isbn13: normalizeIsbn(tagValue(body, 'isbn13')),
      rating: tagValue(body, 'user_rating'),
      review: tagValue(body, 'user_review'),
      shelves,
      status: getStatus(shelves),
      dateRead: rssDateToCsv(tagValue(body, 'user_read_at')),
      dateAdded: rssDateToCsv(tagValue(body, 'user_date_added')),
      fingerprint: crypto
        .createHash('sha256')
        .update(raw.replace(/\s+/g, ' ').trim())
        .digest('hex'),
    })
  }

  return items
}

function parseCsv(input) {
  const rows = []
  let row = []
  let field = ''
  let insideQuotes = false

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]
    const nextCharacter = input[index + 1]

    if (insideQuotes) {
      if (character === '"' && nextCharacter === '"') {
        field += '"'
        index += 1
      } else if (character === '"') {
        insideQuotes = false
      } else {
        field += character
      }
    } else if (character === '"') {
      insideQuotes = true
    } else if (character === ',') {
      row.push(field)
      field = ''
    } else if (character === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (character !== '\r') {
      field += character
    }
  }

  if (field || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}

function rowsToObjects(rows) {
  const [headers, ...entries] = rows

  return entries
    .filter((row) => row.length > 1)
    .map((row) =>
      Object.fromEntries(
        headers.map((header, index) => [header, row[index] || '']),
      ),
    )
}

function csvEscape(value) {
  const stringValue = String(value ?? '')

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`
  }

  return stringValue
}

function toCsv(rows) {
  return `${rows.map((row) => row.map(csvEscape).join(',')).join('\n')}\n`
}

function mergeBook(existing, item) {
  return {
    goodreads_id: item.bookId,
    title: item.title || existing?.title || '',
    author: item.author || existing?.author || '',
    isbn: item.isbn || existing?.isbn || '',
    isbn13: item.isbn13 || existing?.isbn13 || '',
    rating: item.rating || existing?.rating || '0',
    status: item.status || existing?.status || '',
    date_read: item.dateRead || existing?.date_read || '',
    date_added: item.dateAdded || existing?.date_added || '',
    favorite: existing?.favorite || 'false',
    review: existing?.review || item.review || '',
  }
}

function mergeBooksCsv(input, items) {
  const existingBooks = rowsToObjects(parseCsv(input))
  const booksById = new Map(
    existingBooks.map((book) => [book.goodreads_id, book]),
  )

  for (const item of items) {
    booksById.set(item.bookId, mergeBook(booksById.get(item.bookId), item))
  }

  const outputRows = [
    BOOK_HEADERS,
    ...Array.from(booksById.values()).map((book) =>
      BOOK_HEADERS.map((header) => book[header] || ''),
    ),
  ]

  return toCsv(outputRows)
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}

function replaceBookEvents(events, bookId, nextEvents) {
  return [
    ...events.filter((event) => event.bookId !== bookId),
    ...nextEvents,
  ].sort((a, b) => {
    const dateDifference =
      readDateSortValue(a.dateFinished || a.dateStarted) -
      readDateSortValue(b.dateFinished || b.dateStarted)

    return dateDifference || a.bookId.localeCompare(b.bookId)
  })
}

function heartbeatDue(lastHeartbeatAt, now) {
  if (!lastHeartbeatAt) {
    return true
  }

  const age = now.getTime() - new Date(lastHeartbeatAt).getTime()
  return age >= HEARTBEAT_DAYS * 24 * 60 * 60 * 1000
}

async function fetchRss(args) {
  if (args.rssFile) {
    return fs.readFileSync(args.rssFile, 'utf8')
  }

  const rssUrl = process.env.GOODREADS_RSS_URL
  if (!rssUrl) {
    throw new Error(
      'Missing GOODREADS_RSS_URL. Copy the RSS URL from the bottom of your Goodreads shelves page.',
    )
  }

  const response = await fetch(rssUrl)
  if (!response.ok) {
    throw new Error(`Goodreads RSS returned ${response.status}`)
  }

  return response.text()
}

async function fetchReviewHtml(args, item, cookie) {
  if (args.htmlDir) {
    return fs.readFileSync(path.join(args.htmlDir, `${item.bookId}.html`), 'utf8')
  }

  if (!cookie) {
    throw new Error('Missing GOODREADS_COOKIE for reread session sync.')
  }

  return fetchGoodreads(
    `https://www.goodreads.com/review/edit/${item.bookId}`,
    cookie,
  )
}

async function syncGoodreads(args) {
  const now = new Date()
  const rss = await fetchRss(args)
  const feedItems = parseRss(rss)
  const selectedItems =
    args.bookIds.length > 0
      ? feedItems.filter((item) => args.bookIds.includes(item.bookId))
      : feedItems

  if (selectedItems.length === 0) {
    throw new Error('The Goodreads RSS feed did not contain any matching books.')
  }

  const state = readJson(STATE_PATH, {
    version: 1,
    fingerprints: {},
    pendingBookIds: [],
    lastHeartbeatAt: null,
  })
  const eventDocument = readJson(EVENTS_PATH, {
    version: 1,
    generatedAt: null,
    source: 'goodreads-review-edit',
    events: [],
  })
  const pending = new Set(state.pendingBookIds || [])
  const changedItems = selectedItems.filter(
    (item) =>
      args.force ||
      pending.has(item.bookId) ||
      state.fingerprints[item.bookId] !== item.fingerprint,
  )

  if (changedItems.length === 0) {
    if (heartbeatDue(state.lastHeartbeatAt, now) && !args.dryRun) {
      state.lastHeartbeatAt = now.toISOString()
      fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true })
      fs.writeFileSync(STATE_PATH, formatJson(state))
      console.log('No Goodreads changes; refreshed the sync heartbeat.')
    } else {
      console.log('No Goodreads changes to sync.')
    }

    return { booksChanged: false, eventsChanged: false, processed: 0 }
  }

  const cookie = process.env.GOODREADS_COOKIE || ''
  let events = eventDocument.events || []
  let eventsChanged = false
  const successfulItems = []
  const failures = []

  for (const [index, item] of changedItems.entries()) {
    if (item.status !== 'read') {
      successfulItems.push(item)
      pending.delete(item.bookId)
      state.fingerprints[item.bookId] = item.fingerprint
      continue
    }

    try {
      console.log(
        `Syncing rereads ${index + 1}/${changedItems.length}: ${item.title} (${item.bookId})`,
      )
      const html = await fetchReviewHtml(args, item, cookie)
      const nextEvents = parseReadEvents(html, {
        goodreadsId: item.bookId,
        title: item.title,
        author: item.author,
      })

      if (nextEvents.length === 0) {
        throw new Error('No reading sessions found on the review edit page.')
      }

      events = replaceBookEvents(events, item.bookId, nextEvents)
      eventsChanged = true
      successfulItems.push(item)
      pending.delete(item.bookId)
      state.fingerprints[item.bookId] = item.fingerprint
    } catch (error) {
      pending.add(item.bookId)
      failures.push({ bookId: item.bookId, error: error.message })

      if (/sign in|GOODREADS_COOKIE/i.test(error.message)) {
        for (const remainingItem of changedItems.slice(index + 1)) {
          pending.add(remainingItem.bookId)
        }
        break
      }
    }

    if (!args.htmlDir) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  const booksInput = fs.readFileSync(BOOKS_PATH, 'utf8')
  const booksOutput = mergeBooksCsv(booksInput, successfulItems)
  const booksChanged = booksOutput !== booksInput

  state.pendingBookIds = Array.from(pending).sort()
  state.lastHeartbeatAt = now.toISOString()
  state.lastAttemptAt = now.toISOString()
  state.lastErrors = failures

  if (!args.dryRun) {
    fs.mkdirSync(path.dirname(EVENTS_PATH), { recursive: true })

    if (booksChanged) {
      fs.writeFileSync(BOOKS_PATH, booksOutput)
    }

    if (eventsChanged) {
      fs.writeFileSync(
        EVENTS_PATH,
        formatJson({
          version: 1,
          generatedAt: now.toISOString(),
          source: 'goodreads-review-edit',
          events,
        }),
      )
    }

    fs.writeFileSync(STATE_PATH, formatJson(state))
  }

  console.log(
    `${args.dryRun ? 'Would sync' : 'Synced'} ${successfulItems.length} Goodreads books; ${failures.length} need retry.`,
  )

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`${failure.bookId}: ${failure.error}`)
    }
    process.exitCode = 1
  }

  return {
    booksChanged,
    eventsChanged,
    processed: successfulItems.length,
    failures,
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.help) {
    console.log(usage())
    return
  }

  await syncGoodreads(args)
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}

export {
  getStatus,
  mergeBooksCsv,
  parseRss,
  replaceBookEvents,
  rssDateToCsv,
  syncGoodreads,
}
