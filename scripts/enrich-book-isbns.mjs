import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const booksPath = path.join(root, 'content/reading/books.csv')
const headers = [
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

function getColumnIndex(row) {
  return Object.fromEntries(row.map((header, index) => [header, index]))
}

function rowsToObjects(rows) {
  const rawHeaders = rows[0].map((header) =>
    header === 'id' ? 'goodreads_id' : header,
  )
  const columnIndex = getColumnIndex(rawHeaders)

  return rows
    .slice(1)
    .filter((row) => row.length > 1)
    .map((row) =>
      Object.fromEntries(
        headers.map((header) => [header, row[columnIndex[header]] || '']),
      ),
    )
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function normalizeIsbn(value) {
  return String(value || '').replace(/[^0-9X]/gi, '')
}

function titleMatches(queryTitle, candidateTitle) {
  const query = normalizeText(queryTitle)
  const candidate = normalizeText(candidateTitle)

  return candidate.includes(query) || query.includes(candidate)
}

function authorMatches(queryAuthor, candidateAuthors) {
  const query = normalizeText(queryAuthor)
  const queryParts = query.split(' ').filter(Boolean)
  const queryLastName = queryParts[queryParts.length - 1]
  const candidates = Array.isArray(candidateAuthors)
    ? candidateAuthors
    : [candidateAuthors]

  return candidates.some((author) => {
    const candidate = normalizeText(author || '')
    return candidate.includes(query) || candidate.includes(queryLastName)
  })
}

function getIndustryIsbns(identifiers = []) {
  return identifiers.reduce(
    (isbns, identifier) => {
      if (identifier.type === 'ISBN_10') {
        isbns.isbn = normalizeIsbn(identifier.identifier)
      }

      if (identifier.type === 'ISBN_13') {
        isbns.isbn13 = normalizeIsbn(identifier.identifier)
      }

      return isbns
    },
    { isbn: '', isbn13: '' },
  )
}

function hasEnglishLanguage(edition) {
  const languages = edition.languages || []

  return languages.some((language) => {
    return language.key === '/languages/eng'
  })
}

function hasKnownEnglishPublisher(edition) {
  const publishers = (edition.publishers || []).join(' ').toLowerCase()
  const englishPublisherHints = [
    'penguin',
    'random house',
    'tor',
    'orbit',
    'gollancz',
    'harper',
    'simon',
    'schuster',
    'bloomsbury',
    'macmillan',
    'hachette',
    'vintage',
    'del rey',
    'doubleday',
    'scribner',
    'ace',
    'bantam',
    'little, brown',
  ]

  return englishPublisherHints.some((publisher) =>
    publishers.includes(publisher),
  )
}

function hasNonEnglishTitleHint(edition) {
  return /\b(japanese|spanish|portuguese|french|german|italian|russian)\b/i.test(
    edition.title || '',
  )
}

function scoreEdition(edition) {
  let score = 0

  if (edition.isbn_13?.length) {
    score += 4
  }

  if (edition.isbn_10?.length) {
    score += 2
  }

  if (hasEnglishLanguage(edition)) {
    score += 8
  }

  if (hasKnownEnglishPublisher(edition)) {
    score += 5
  }

  if (!edition.languages?.length) {
    score -= 2
  }

  if (hasNonEnglishTitleHint(edition)) {
    score -= 10
  }

  return score
}

async function searchGoogleBooks(book) {
  const query = new URLSearchParams({
    q: `intitle:${book.title} inauthor:${book.author}`,
    maxResults: '10',
    printType: 'books',
  })
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?${query.toString()}`,
  )

  if (response.status === 429 || !response.ok) {
    return undefined
  }

  const data = await response.json()
  const items = data.items || []
  const match = items.find((item) => {
    const info = item.volumeInfo || {}

    return (
      titleMatches(book.title, info.title || '') &&
      authorMatches(book.author, info.authors || [])
    )
  })

  if (!match) {
    return undefined
  }

  return getIndustryIsbns(match.volumeInfo?.industryIdentifiers)
}

async function searchOpenLibrary(book) {
  const query = new URLSearchParams({
    title: book.title,
    author: book.author,
    limit: '10',
  })
  const response = await fetch(
    `https://openlibrary.org/search.json?${query.toString()}`,
  )

  if (!response.ok) {
    return undefined
  }

  const data = await response.json()
  const docs = data.docs || []
  const match = docs.find((doc) => {
    return (
      titleMatches(book.title, doc.title || '') &&
      authorMatches(book.author, doc.author_name || [])
    )
  })

  if (!match) {
    return undefined
  }

  const directIsbn = {
    isbn: normalizeIsbn(match.isbn?.find((isbn) => isbn.length === 10) || ''),
    isbn13: normalizeIsbn(match.isbn?.find((isbn) => isbn.length === 13) || ''),
  }

  if (directIsbn.isbn || directIsbn.isbn13 || !match.key) {
    return directIsbn
  }

  const editionsResponse = await fetch(
    `https://openlibrary.org${match.key}/editions.json?limit=20`,
  )

  if (!editionsResponse.ok) {
    return undefined
  }

  const editionsData = await editionsResponse.json()
  const editions = editionsData.entries || []
  const edition = editions
    .filter((entry) => {
      return entry.isbn_13?.length || entry.isbn_10?.length
    })
    .sort((a, b) => scoreEdition(b) - scoreEdition(a))[0]

  if (!edition || scoreEdition(edition) < 5) {
    return undefined
  }

  return {
    isbn: normalizeIsbn(edition?.isbn_10?.[0] || ''),
    isbn13: normalizeIsbn(edition?.isbn_13?.[0] || ''),
  }
}

async function findIsbns(book) {
  const googleResult = await searchGoogleBooks(book)

  if (googleResult?.isbn || googleResult?.isbn13) {
    return googleResult
  }

  return searchOpenLibrary(book)
}

const rows = parseCsv(fs.readFileSync(booksPath, 'utf8'))
const books = rowsToObjects(rows)
const booksMissingIsbn = books.filter((book) => !book.isbn && !book.isbn13)
let updated = 0
let checked = 0

for (const book of booksMissingIsbn) {
  checked += 1

  try {
    const result = await findIsbns(book)

    if (result?.isbn || result?.isbn13) {
      book.isbn = book.isbn || result.isbn || ''
      book.isbn13 = book.isbn13 || result.isbn13 || ''
      updated += 1
      console.log(`found: ${book.title} — ${book.isbn13 || book.isbn}`)
    } else {
      console.log(`missing: ${book.title}`)
    }
  } catch (error) {
    console.log(`error: ${book.title} — ${error.message}`)
  }

  await new Promise((resolve) => setTimeout(resolve, 120))
}

const outputRows = [
  headers,
  ...books.map((book) => headers.map((header) => book[header])),
]
fs.writeFileSync(booksPath, toCsv(outputRows))

console.log(`Checked ${checked} books, updated ${updated}.`)
