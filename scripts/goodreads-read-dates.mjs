import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

if (typeof process.loadEnvFile === 'function' && fs.existsSync('.env.local')) {
  process.loadEnvFile('.env.local')
}

const GOODREADS_BASE_URL = 'https://www.goodreads.com'
const DEFAULT_OUT_PATH = 'content/reading/imports/goodreads-read-events.json'
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

function parseArgs(argv) {
  const args = {
    bookIds: [],
    shelf: 'read',
    out: DEFAULT_OUT_PATH,
    limit: Infinity,
    rereadsOnly: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    const next = argv[index + 1]

    if (arg === '--csv') {
      args.csv = next
      index += 1
    } else if (arg === '--book-id') {
      args.bookIds.push(next)
      index += 1
    } else if (arg === '--user') {
      args.user = next
      index += 1
    } else if (arg === '--html-file') {
      args.htmlFile = next
      index += 1
    } else if (arg === '--shelf') {
      args.shelf = next
      index += 1
    } else if (arg === '--cookie') {
      args.cookie = next
      index += 1
    } else if (arg === '--cookie-file') {
      args.cookieFile = next
      index += 1
    } else if (arg === '--out') {
      args.out = next
      index += 1
    } else if (arg === '--limit') {
      args.limit = Number(next)
      index += 1
    } else if (arg === '--rereads-only') {
      args.rereadsOnly = true
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
  GOODREADS_COOKIE='...' npm run reading:goodreads -- --csv path/to/goodreads.csv
  GOODREADS_COOKIE='...' npm run reading:goodreads -- --book-id 35519109
  GOODREADS_COOKIE='...' npm run reading:goodreads -- --user 123456-rui --shelf read
  npm run reading:goodreads -- --html-file review-edit.html --book-id 35519109

Options:
  --csv <path>          Goodreads library export used to discover book ids
  --book-id <id>       Fetch one Goodreads review/edit page, repeatable
  --user <id-or-slug>  Crawl a Goodreads shelf to discover book ids
  --html-file <path>   Parse a saved Goodreads review/edit HTML page
  --shelf <name>       Shelf for --user mode, defaults to read
  --cookie <cookie>    Goodreads Cookie header value
  --cookie-file <path> Read Cookie header value from a local file
  --out <path>         Output JSON path, defaults to ${DEFAULT_OUT_PATH}
  --limit <number>     Stop after N books while testing
  --rereads-only       With --csv, fetch only books whose exported Read Count is greater than 1
`.trim()
}

function readCookie(args) {
  if (args.cookie) {
    return args.cookie
  }

  if (args.cookieFile) {
    return fs.readFileSync(args.cookieFile, 'utf8').trim()
  }

  return process.env.GOODREADS_COOKIE || ''
}

function normalizeCookie(cookie) {
  const value = cookie.trim()

  if (/^cookie\s*:/i.test(value)) {
    throw new Error(
      'GOODREADS_COOKIE must contain only the Cookie header value, without the "Cookie:" label.',
    )
  }

  if (/(?:^|;\s*)_session_id2=/.test(value)) {
    return value
  }

  if (value && !/[;=\s]/.test(value)) {
    return `_session_id2=${value}`
  }

  if (!value || !/(?:^|;\s*)_session_id2=/.test(value)) {
    throw new Error(
      'GOODREADS_COOKIE does not contain the Goodreads _session_id2 session cookie.',
    )
  }
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

function getColumnIndex(headers) {
  return Object.fromEntries(headers.map((header, index) => [header, index]))
}

function rowsToObjects(rows) {
  const [headers, ...entries] = rows
  const columnIndex = getColumnIndex(headers)

  return entries
    .filter((row) => row.length > 1)
    .map((row) =>
      Object.fromEntries(
        headers.map((header) => [header, row[columnIndex[header]] || '']),
      ),
    )
}

function uniqueBooks(books) {
  const seen = new Set()

  return books.filter((book) => {
    if (!book.goodreadsId || seen.has(book.goodreadsId)) {
      return false
    }

    seen.add(book.goodreadsId)
    return true
  })
}

function booksFromCsv(csvPath, { rereadsOnly = false } = {}) {
  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'))

  return uniqueBooks(
    rowsToObjects(rows)
      .filter(
        (book) => !rereadsOnly || Number(book['Read Count'] || 0) > 1,
      )
      .map((book) => ({
        goodreadsId: book['Book Id'],
        title: book.Title,
        author: book.Author,
        exportedDateRead: book['Date Read'],
        exportedReadCount: book['Read Count'],
      })),
  )
}

function stripTags(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function reviewPageDiagnostic(html) {
  const title = stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
  const controls = Array.from(
    html.matchAll(
      /<(?:input|select)\b[^>]*(?:name|class|id)=["']([^"']*(?:read|date|session)[^"']*)["'][^>]*>/gi,
    ),
    (match) => match[1],
  )

  return `title=${JSON.stringify(title || 'unknown')}; date controls=${JSON.stringify(
    Array.from(new Set(controls)).slice(0, 20),
  )}; bytes=${Buffer.byteLength(html)}`
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function selectedTextForClass(html, className) {
  const classPattern = escapeRegExp(className)
  const containerMatch = html.match(
    new RegExp(
      `class=["'][^"']*\\b${classPattern}\\b[^"']*["'][\\s\\S]*?<\\/select>`,
      'i',
    ),
  )

  if (!containerMatch) {
    return ''
  }

  const selectedMatch = containerMatch[0].match(
    /<option\b[^>]*(?:selected=(["'])selected\1|selected\b)[^>]*>([\s\S]*?)<\/option>/i,
  )

  return selectedMatch ? stripTags(selectedMatch[2]) : ''
}

function toPartialDate(parts) {
  const day = Number(parts.day)
  const year = Number(parts.year)
  const monthNames = {
    jan: 1,
    january: 1,
    feb: 2,
    february: 2,
    mar: 3,
    march: 3,
    apr: 4,
    april: 4,
    may: 5,
    jun: 6,
    june: 6,
    jul: 7,
    july: 7,
    aug: 8,
    august: 8,
    sep: 9,
    sept: 9,
    september: 9,
    oct: 10,
    october: 10,
    nov: 11,
    november: 11,
    dec: 12,
    december: 12,
  }
  const month = monthNames[String(parts.month).toLowerCase()] || Number(parts.month)

  if (!year) {
    return null
  }

  return {
    year,
    ...(month ? { month } : {}),
    ...(month && day ? { day } : {}),
  }
}

function splitReadingSessionRows(html) {
  const tableRows = Array.from(
    html.matchAll(
      /<tr\b[^>]*class=["'][^"']*\breadingSessionRow\b[^"']*["'][^>]*>[\s\S]*?<\/tr>/gi,
    ),
    (match) => match[0],
  )

  if (tableRows.length > 0) {
    return tableRows
  }

  const rows = []
  const marker = 'readingSessionRow'
  let searchIndex = 0

  while (searchIndex < html.length) {
    const markerIndex = html.indexOf(marker, searchIndex)
    if (markerIndex === -1) {
      break
    }

    const divStart = html.lastIndexOf('<div', markerIndex)
    const start = divStart
    const nextMarkerIndex = html.indexOf(marker, markerIndex + marker.length)
    const divEnd = html.indexOf('</div>', markerIndex)
    const end =
      divEnd !== -1 && (nextMarkerIndex === -1 || divEnd < nextMarkerIndex)
        ? divEnd
        : nextMarkerIndex === -1
          ? html.length
          : nextMarkerIndex

    rows.push(html.slice(start === -1 ? markerIndex : start, end))
    searchIndex = end
  }

  return rows
}

function readDateFromRow(row, prefix) {
  return toPartialDate({
    day: selectedTextForClass(row, `${prefix}Day`),
    month: selectedTextForClass(row, `${prefix}Month`),
    year: selectedTextForClass(row, `${prefix}Year`),
  })
}

function readDateSortValue(date) {
  if (!date) {
    return 0
  }

  return date.year * 10_000 + (date.month || 0) * 100 + (date.day || 0)
}

function parseReadEvents(html, book) {
  return splitReadingSessionRows(html)
    .map((row) => ({
      bookId: book.goodreadsId,
      title: book.title || '',
      author: book.author || '',
      source: 'goodreads-review-edit',
      sourceUrl: `${GOODREADS_BASE_URL}/review/edit/${book.goodreadsId}`,
      dateStarted: readDateFromRow(row, 'start'),
      dateFinished: readDateFromRow(row, 'end'),
    }))
    .filter((event) => event.dateStarted || event.dateFinished)
    .sort(
      (a, b) =>
        readDateSortValue(a.dateFinished || a.dateStarted) -
        readDateSortValue(b.dateFinished || b.dateStarted),
    )
    .map((event, index) => ({
      ...event,
      sessionIndex: index + 1,
    }))
}

function parseShelfBooks(html) {
  const books = []
  const seen = new Set()
  const bookLinkPattern =
    /<a\b[^>]*href=["']\/book\/show\/(\d+)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi
  let match

  while ((match = bookLinkPattern.exec(html))) {
    const goodreadsId = match[1]
    const title = stripTags(match[2])

    if (!seen.has(goodreadsId) && title) {
      seen.add(goodreadsId)
      books.push({ goodreadsId, title, author: '' })
    }
  }

  return books
}

async function fetchGoodreads(url, cookie) {
  const normalizedCookie = normalizeCookie(cookie)

  const response = await fetch(url, {
    headers: {
      Cookie: normalizedCookie,
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    redirect: 'follow',
  })

  const html = await response.text()

  if (!response.ok) {
    throw new Error(`Goodreads returned ${response.status} for ${url}`)
  }

  if (
    /\/user\/sign_in(?:[/?#]|$)/i.test(response.url) ||
    /<title[^>]*>[^<]*sign (?:in|up)[^<]*<\/title>/i.test(html) ||
    /name=["']user\[(?:email|password)\]["']/i.test(html)
  ) {
    throw new Error(
      `Goodreads returned a signed-out page for ${url}. Refresh GOODREADS_COOKIE.`,
    )
  }

  return html
}

async function booksFromShelf(user, shelf, cookie) {
  const books = []
  const seen = new Set()

  for (let page = 1; page <= 100; page += 1) {
    const url = `${GOODREADS_BASE_URL}/review/list/${encodeURIComponent(
      user,
    )}?shelf=${encodeURIComponent(shelf)}&per_page=100&page=${page}`
    const html = await fetchGoodreads(url, cookie)
    const pageBooks = parseShelfBooks(html).filter((book) => {
      if (seen.has(book.goodreadsId)) {
        return false
      }

      seen.add(book.goodreadsId)
      return true
    })

    if (pageBooks.length === 0) {
      break
    }

    books.push(...pageBooks)
    console.log(`Discovered ${books.length} books from ${shelf}, page ${page}`)
  }

  return books
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.help) {
    console.log(usage())
    return
  }

  const cookie = readCookie(args)

  if (!cookie && !args.htmlFile) {
    throw new Error(
      'Missing Goodreads cookie. Set GOODREADS_COOKIE, pass --cookie, or pass --cookie-file.',
    )
  }

  let books = []

  if (args.htmlFile) {
    const goodreadsId = args.bookIds[0] || path.basename(args.htmlFile)
    const html = fs.readFileSync(args.htmlFile, 'utf8')
    const book = {
      goodreadsId,
      title: '',
      author: '',
    }
    const output = {
      generatedAt: new Date().toISOString(),
      source: 'goodreads-review-edit-html',
      booksChecked: 1,
      events: parseReadEvents(html, book),
      errors: [],
    }

    if (output.events.length === 0) {
      output.errors.push({
        bookId: book.goodreadsId,
        title: '',
        error: 'No reading sessions found in HTML file.',
      })
    }

    fs.mkdirSync(path.dirname(args.out), { recursive: true })
    fs.writeFileSync(args.out, `${JSON.stringify(output, null, 2)}\n`)
    console.log(
      `Wrote ${output.events.length} read events from ${args.htmlFile} to ${args.out}`,
    )
    return
  }

  if (args.csv) {
    books = booksFromCsv(args.csv, { rereadsOnly: args.rereadsOnly })
  }

  if (args.user) {
    books.push(...(await booksFromShelf(args.user, args.shelf, cookie)))
  }

  if (args.bookIds.length > 0) {
    books.push(
      ...args.bookIds.map((goodreadsId) => ({
        goodreadsId,
        title: '',
        author: '',
      })),
    )
  }

  books = uniqueBooks(books).slice(0, args.limit)

  if (books.length === 0) {
    throw new Error('No books to fetch. Pass --csv, --book-id, or --user.')
  }

  const output = {
    generatedAt: new Date().toISOString(),
    source: 'goodreads-review-edit',
    booksChecked: books.length,
    events: [],
    errors: [],
  }

  for (let index = 0; index < books.length; index += 1) {
    const book = books[index]
    const label = book.title
      ? `${book.title} (${book.goodreadsId})`
      : book.goodreadsId

    try {
      console.log(`Fetching ${index + 1}/${books.length}: ${label}`)
      const html = await fetchGoodreads(
        `${GOODREADS_BASE_URL}/review/edit/${book.goodreadsId}`,
        cookie,
      )
      const events = parseReadEvents(html, book)

      output.events.push(...events)

      if (events.length === 0) {
        output.errors.push({
          bookId: book.goodreadsId,
          title: book.title || '',
          error: `No reading sessions found on review/edit page (${reviewPageDiagnostic(html)}).`,
        })
      }
    } catch (error) {
      output.errors.push({
        bookId: book.goodreadsId,
        title: book.title || '',
        error: error.message,
      })

      if (/signed-out|GOODREADS_COOKIE/i.test(error.message)) {
        break
      }
    }
  }

  const authenticationError = output.errors.find((entry) =>
    /signed-out|GOODREADS_COOKIE/i.test(entry.error),
  )

  if (authenticationError) {
    console.error(authenticationError.error)
    process.exitCode = 1
    return
  }

  fs.mkdirSync(path.dirname(args.out), { recursive: true })
  fs.writeFileSync(args.out, `${JSON.stringify(output, null, 2)}\n`)

  console.log(
    `Wrote ${output.events.length} read events for ${books.length} books to ${args.out}`,
  )

  if (output.errors.length > 0) {
    console.log(`${output.errors.length} books need review; see errors in JSON.`)
  }
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
  booksFromCsv,
  booksFromShelf,
  fetchGoodreads,
  parseReadEvents,
  parseShelfBooks,
  readDateSortValue,
  reviewPageDiagnostic,
  normalizeCookie,
}
