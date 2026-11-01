'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import BookCard, { Book } from '@/components/BookCard'

const CATEGORIES = ['All', 'Fiction', 'Science', 'History', 'Kids', 'Others']

export default function AllBooksClient({ initialBooks }: { initialBooks: Book[] }) {
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get('category')
  const initialCategory = CATEGORIES.includes(urlCategory ?? '') ? (urlCategory as string) : 'All'

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(initialCategory)

  const filtered = useMemo(() => {
    return initialBooks.filter(b => {
      const matchCat = category === 'All' || b.category === category
      const matchSearch = search === '' ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [initialBooks, search, category])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
     
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-[#1A1A1A] mb-2">All Books</h1>
        <p className="text-[#5A5A5A]">Browse our entire collection and find your next great read.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A5A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#D4CDB8] rounded-xl text-sm focus:outline-none focus:border-[#2D5016] bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-[#2D5016] text-white'
                  : 'bg-white border border-[#D4CDB8] text-[#1A1A1A] hover:border-[#2D5016] hover:text-[#2D5016]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-[#5A5A5A] mb-6">
        {filtered.length} book{filtered.length !== 1 ? 's' : ''} found
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map(book => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#D4CDB8]">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="font-bold text-[#1A1A1A] text-lg mb-2">No books found</h3>
          <p className="text-[#5A5A5A] text-sm">Try a different search term or category.</p>
        </div>
      )}
    </div>
  )
}
