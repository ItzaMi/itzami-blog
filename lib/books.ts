import fs from 'fs'
import path from 'path'

const booksPath = path.join(
  process.cwd(),
  'content/reading/books.csv',
)

export interface Book {
  goodreadsId: string
  title: string
  author: string
  rating: number
  status: string
  dateRead: string
  dateAdded: string
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

  return new Date(date.replaceAll('/', '-')).getTime()
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

export function getReadingData(): ReadingData {
  const fileContents = fs.readFileSync(booksPath, 'utf8')
  const rows = parseCsv(fileContents)
  const headers = rows[0]
  const columnIndex = getColumnIndex(headers)
  const books = rows
    .slice(1)
    .filter((row) => row.length > 1)
    .map((row) => toBook(row, columnIndex))

  const currentlyReading = books
    .filter((book) => book.status === 'currently-reading')
    .sort(sortAlphabetically)

  const recentlyRead = books
    .filter((book) => book.status === 'read' && book.dateRead)
    .sort((a, b) => toDateValue(b.dateRead) - toDateValue(a.dateRead))

  const readWithoutDates = books
    .filter((book) => book.status === 'read' && !book.dateRead)
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
      read: books.filter((book) => book.status === 'read').length,
      currentlyReading: currentlyReading.length,
      toRead: books.filter((book) => book.status === 'to-read').length,
      didNotFinish: books.filter((book) => book.status === 'did-not-finish')
        .length,
    },
  }
}
