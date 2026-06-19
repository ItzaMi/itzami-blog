import { Book } from '../../lib/books'

interface Props {
  books: Book[]
  showReadDate?: boolean
}

const BookList = ({ books, showReadDate = false }: Props) => {
  return (
    <ol className="mt-4 grid gap-1">
      {books.map((book, index) => (
        <li
          className="grid grid-cols-[34px_1fr_auto] items-baseline gap-3 rounded-md px-2.5 py-1.5 text-sm leading-[24px] tracking-tight transition-all duration-200 ease-in hover:bg-hover max-sm:grid-cols-[22px_1fr] max-sm:gap-x-2"
          key={book.goodreadsId || `${book.title}-${book.author}`}
        >
          <span className="font-mono text-[11px] text-muted">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>
            <span className="text-primary">{book.title}</span>
            <span className="text-muted max-sm:block"> by {book.author}</span>
          </span>
          {showReadDate ? (
            <span className="text-right text-[13px] text-muted max-sm:col-start-2 max-sm:text-left">
              {book.dateRead}
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

export default BookList
