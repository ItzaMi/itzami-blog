import fs from 'fs'
import path from 'path'

const booksPath = path.join(
  process.cwd(),
  'content/reading/books.csv',
)
const readEventsPath = path.join(
  process.cwd(),
  'content/reading/imports/goodreads-read-events.json',
)

export interface Book {
  goodreadsId: string
  title: string
  author: string
  rating: number
  status: string
  dateRead: string
  dateAdded: string
  readEventId?: string
  readSessionIndex?: number
  isReread?: boolean
}

interface ReadDate {
  year: number
  month?: number
  day?: number
}

interface ReadEvent {
  bookId: string
  title: string
  author: string
  sessionIndex: number
  dateStarted: ReadDate | null
  dateFinished: ReadDate | null
}

export interface ReadingData {
  currentlyReading: Book[]
  read: Book[]
  toRead: Book[]
  didNotFinish: Book[]
  counts: {
    total: number
    read: number
    currentlyReading: number
    toRead: number
    didNotFinish: number
  }
}

function parseCsv(input: string) {
  const rows: string[][] = []
  let row: string[] = []
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

function sortAlphabetically(a: Book, b: Book) {
  return a.title.localeCompare(b.title)
}

function toDateValue(date: string) {
  if (!date) {
    return 0
  }

  const [year, month = '0', day = '0'] = date.split('/')
  return Number(year) * 10_000 + Number(month) * 100 + Number(day)
}

function cleanText(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function getColumnIndex(headers: string[]) {
  return Object.fromEntries(headers.map((header, index) => [header, index]))
}

function toBook(row: string[], columnIndex: Record<string, number>): Book {
  return {
    goodreadsId: row[columnIndex.goodreads_id] || '',
    title: cleanText(row[columnIndex.title] || ''),
    author: cleanText(row[columnIndex.author] || ''),
    rating: Number(row[columnIndex.rating] || 0),
    status: row[columnIndex.status] || '',
    dateRead: row[columnIndex.date_read] || '',
    dateAdded: row[columnIndex.date_added] || '',
  }
}

function readDateToString(date: ReadDate | null) {
  if (!date?.year) {
    return ''
  }

  return [
    String(date.year),
    ...(date.month ? [String(date.month).padStart(2, '0')] : []),
    ...(date.day ? [String(date.day).padStart(2, '0')] : []),
  ].join('/')
}

function getReadEvents(): ReadEvent[] {
  if (!fs.existsSync(readEventsPath)) {
    return []
  }

  const document = JSON.parse(fs.readFileSync(readEventsPath, 'utf8'))
  return Array.isArray(document.events) ? document.events : []
}

export function getReadingData(): ReadingData {
  const fileContents = fs.readFileSync(booksPath, 'utf8')
  const rows = parseCsv(fileContents)
  const headers = rows[0]
  const columnIndex = getColumnIndex(headers)
  const books = rows
    .slice(1)
    .filter((row) => row.length > 1)
    .map((row) => toBook(row, columnIndex))
  const booksById = new Map(books.map((book) => [book.goodreadsId, book]))
  const readEvents = getReadEvents()
  const eventCountsByBook = readEvents.reduce<Record<string, number>>(
    (counts, event) => ({
      ...counts,
      [event.bookId]: (counts[event.bookId] || 0) + 1,
    }),
    {},
  )
  const booksWithEvents = new Set(readEvents.map((event) => event.bookId))

  const currentlyReading = books
    .filter((book) => book.status === 'currently-reading')
    .sort(sortAlphabetically)

  const eventReads = readEvents.map((event) => {
    const book = booksById.get(event.bookId)
    const dateRead = readDateToString(event.dateFinished || event.dateStarted)

    return {
      goodreadsId: event.bookId,
      title: book?.title || event.title,
      author: book?.author || event.author,
      rating: book?.rating || 0,
      status: 'read',
      dateRead,
      dateAdded: book?.dateAdded || '',
      readEventId: `${event.bookId}:${event.sessionIndex}:${dateRead}`,
      readSessionIndex: event.sessionIndex,
      isReread:
        eventCountsByBook[event.bookId] > 1 && event.sessionIndex > 1,
    }
  })
  const fallbackReads = books.filter(
    (book) => book.status === 'read' && !booksWithEvents.has(book.goodreadsId),
  )
  const recentlyRead = [...eventReads, ...fallbackReads]
    .filter((book) => book.dateRead)
    .sort((a, b) => toDateValue(b.dateRead) - toDateValue(a.dateRead))

  const readWithoutDates = fallbackReads
    .filter((book) => !book.dateRead)
    .sort(sortAlphabetically)

  const toRead = books
    .filter((book) => book.status === 'to-read')
    .sort(sortAlphabetically)

  const didNotFinish = books
    .filter((book) => book.status === 'did-not-finish')
    .sort(sortAlphabetically)

  return {
    currentlyReading,
    read: [...recentlyRead, ...readWithoutDates],
    toRead,
    didNotFinish,
    counts: {
      total: books.length,
      read: eventReads.length + fallbackReads.length,
      currentlyReading: currentlyReading.length,
      toRead: books.filter((book) => book.status === 'to-read').length,
      didNotFinish: books.filter((book) => book.status === 'did-not-finish')
        .length,
    },
  }
}
