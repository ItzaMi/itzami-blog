import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const goodreadsPath = path.join(
  root,
  'content/reading/goodreads_library_export.csv',
)
const booksPath = path.join(root, 'content/reading/books.csv')
const editableHeaders = [
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

function getColumnIndex(headers) {
  return Object.fromEntries(headers.map((header, index) => [header, index]))
}

function cleanText(value) {
  return value.replace(/\s+/g, ' ').trim()
}

function normalizeIsbn(value) {
  return value.replace(/^="?|"?$/g, '')
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

function goodreadsBookToEditable(row) {
  return {
    goodreads_id: row['Book Id'] || '',
    title: cleanText(row.Title || ''),
    author: cleanText(row.Author || ''),
    isbn: normalizeIsbn(row.ISBN || ''),
    isbn13: normalizeIsbn(row.ISBN13 || ''),
    rating: row['My Rating'] || '',
    status: row['Exclusive Shelf'] || '',
    date_read: row['Date Read'] || '',
    date_added: row['Date Added'] || '',
    favorite: 'false',
    review: row['My Review'] || '',
  }
}

function mergeBook(goodreadsBook, existingBook) {
  if (!existingBook) {
    return goodreadsBook
  }

  return {
    ...goodreadsBook,
    favorite: existingBook.favorite || goodreadsBook.favorite,
    review: existingBook.review || goodreadsBook.review,
  }
}

const goodreadsRows = parseCsv(fs.readFileSync(goodreadsPath, 'utf8'))
const goodreadsBooks = rowsToObjects(goodreadsRows).map(goodreadsBookToEditable)
const existingBooks = fs.existsSync(booksPath)
  ? rowsToObjects(parseCsv(fs.readFileSync(booksPath, 'utf8')))
  : []
const existingBooksById = new Map(
  existingBooks.map((book) => [book.goodreads_id, book]),
)
const mergedBooks = goodreadsBooks.map((book) =>
  mergeBook(book, existingBooksById.get(book.goodreads_id)),
)
const outputRows = [
  editableHeaders,
  ...mergedBooks.map((book) => editableHeaders.map((header) => book[header])),
]

fs.writeFileSync(booksPath, toCsv(outputRows))
console.log(`Wrote ${mergedBooks.length} books to ${booksPath}`)
