import Link from 'next/link'
import Image from 'next/image'

export interface Book {
  _id: string
  title: string
  author: string
  category: string
  image?: string
  description?: string
  userName?: string
  userEmail?: string
  totalCopies?: number
  availableCopies?: number
  createdAt?: string
}

interface BookCardProps {
  book: Book
  showEdit?: boolean
  showDelete?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export default function BookCard({ book, showEdit, showDelete, onEdit, onDelete }: BookCardProps) {
  const categoryColors: Record<string, string> = {
    Fiction: 'bg-blue-100 text-blue-700',
    Science: 'bg-purple-100 text-purple-700',
    History: 'bg-amber-100 text-amber-700',
    Kids: 'bg-pink-100 text-pink-700',
    Others: 'bg-orange-100 text-orange-700',
    'Self-Help': 'bg-green-100 text-green-700',
  }
  const catColor = categoryColors[book.category] || 'bg-gray-100 text-gray-700'

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#D4CDB8] shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F0E8]">
        {book.image ? (
          <Image
            src={book.image}
            alt={book.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#EDE7D8]">
            <span className="text-5xl">📚</span>
          </div>
        )}
        <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${catColor}`}>
          {book.category}
        </span>
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-bold text-[#1A1A1A] leading-tight line-clamp-2 mb-1">{book.title}</h3>
        <p className="text-sm text-[#5A5A5A] mb-3">{book.author}</p>
        <div className="mt-auto flex flex-col gap-2">
          {book.availableCopies !== undefined && (
            <p className={`text-xs font-medium ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {book.availableCopies > 0 ? `${book.availableCopies} cop${book.availableCopies === 1 ? 'y' : 'ies'} available` : 'Not Available'}
            </p>
          )}
          {showEdit || showDelete ? (
            <div className="flex gap-2">
              {showEdit && (
                <button
                  onClick={onEdit}
                  className="flex-1 text-xs font-medium bg-[#2D5016] text-white py-2 rounded-lg hover:bg-[#3D6B20] transition-colors"
                >
                  Edit
                </button>
              )}
              {showDelete && (
                <button
                  onClick={onDelete}
                  className="flex-1 text-xs font-medium bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                >
                  Delete
                </button>
              )}
            </div>
          ) : (
            <Link
              href={`/books/${book._id}`}
              className="text-center text-xs font-semibold text-[#2D5016] border border-[#2D5016] py-2 rounded-lg hover:bg-[#2D5016] hover:text-white transition-colors"
            >
              View Details →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
