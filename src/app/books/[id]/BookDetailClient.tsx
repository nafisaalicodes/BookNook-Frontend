'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { borrowBook } from '@/lib/api'
import toast from 'react-hot-toast'
import type { Book } from '@/components/BookCard'

export default function BookDetailClient({ book }: { book: Book | null }) {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [returnDate, setReturnDate] = useState('')
  const [borrowing, setBorrowing] = useState(false)

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push(`/login?redirect=/books/${book?._id}`)
    }
  }, [isPending, session, router, book?._id])

  if (isPending || (!isPending && !session?.user)) {
    return <div className="flex justify-center py-20"><span className="text-[#5A5A5A]">Loading...</span></div>
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">📭</p>
        <h2 className="font-serif text-2xl font-bold mb-2">Book not found</h2>
        <Link href="/books" className="text-[#2D5016] hover:underline">← Back to All Books</Link>
      </div>
    )
  }

  const categoryColors: Record<string, string> = {
    Fiction: 'bg-blue-100 text-blue-700',
    Science: 'bg-purple-100 text-purple-700',
    History: 'bg-amber-100 text-amber-700',
    Kids: 'bg-pink-100 text-pink-700',
    Others: 'bg-orange-100 text-orange-700',
  }
  const catColor = categoryColors[book.category] || 'bg-gray-100 text-gray-700'
  const isAvailable = (book.availableCopies ?? 1) > 0
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  const handleBorrowClick = () => {
    if (!session?.user) {
      toast.error('Please login to borrow books')
      router.push(`/login?redirect=/books/${book._id}`)
      return
    }
    setShowModal(true)
  }

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!returnDate) {
      toast.error('Please select a return date')
      return
    }
    setBorrowing(true)
    try {
      await borrowBook({
        bookId: book._id,
        bookTitle: book.title,
        bookImage: book.image,
        userEmail: session!.user.email,
        userName: session!.user.name,
        returnDate,
      })
      toast.success('Book borrowed successfully! Happy reading 📚')
      setShowModal(false)
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to borrow book')
    } finally {
      setBorrowing(false)
    }
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/books" className="inline-flex items-center gap-1 text-sm text-[#5A5A5A] hover:text-[#2D5016] mb-8 transition-colors">
          ← Back to All Books
        </Link>

        <div className="bg-white rounded-3xl border border-[#D4CDB8] overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-72 lg:w-80 shrink-0 relative">
              {book.image ? (
                <div className="relative aspect-[3/4] md:h-full md:aspect-auto bg-[#F5F0E8]">
                  <Image src={book.image} alt={book.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="aspect-[3/4] md:h-80 bg-[#EDE7D8] flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>
              )}
            </div>

            <div className="p-8 lg:p-10 flex flex-col">
              <div className="flex items-start gap-3 mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${catColor}`}>{book.category}</span>
                {!isAvailable && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-600">Not Available</span>
                )}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-2">{book.title}</h1>
              <p className="text-lg text-[#5A5A5A] mb-6">by <span className="font-semibold text-[#1A1A1A]">{book.author}</span></p>

              {book.description && (
                <p className="text-[#5A5A5A] leading-relaxed mb-6">{book.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                {book.totalCopies !== undefined && (
                  <div className="bg-[#F5F0E8] rounded-xl p-3">
                    <p className="text-[#5A5A5A] text-xs mb-0.5">Total Copies</p>
                    <p className="font-bold text-[#1A1A1A]">{book.totalCopies}</p>
                  </div>
                )}
                {book.availableCopies !== undefined && (
                  <div className="bg-[#F5F0E8] rounded-xl p-3">
                    <p className="text-[#5A5A5A] text-xs mb-0.5">Available</p>
                    <p className={`font-bold ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                      {book.availableCopies}
                    </p>
                  </div>
                )}
              </div>

              {book.userName && (
                <p className="text-sm text-[#5A5A5A] mb-6">
                  Added by <span className="font-medium text-[#1A1A1A]">{book.userName}</span>
                </p>
              )}

              <div className="mt-auto">
                <button
                  onClick={handleBorrowClick}
                  disabled={!isAvailable}
                  className={`px-8 py-3 rounded-full font-semibold text-sm transition-colors ${
                    isAvailable
                      ? 'bg-[#2D5016] text-white hover:bg-[#3D6B20]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isAvailable ? 'Borrow This Book' : 'Not Available'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && session?.user && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#EDE7D8] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📗</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Borrow This Book</h2>
              <p className="text-sm text-[#5A5A5A] mt-1">{book.title}</p>
            </div>
            <form onSubmit={handleBorrow} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={session.user.name || ''}
                  readOnly
                  className="w-full border border-[#D4CDB8] rounded-xl px-4 py-3 text-sm bg-[#F5F0E8] text-[#5A5A5A] cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Email</label>
                <input
                  type="email"
                  value={session.user.email || ''}
                  readOnly
                  className="w-full border border-[#D4CDB8] rounded-xl px-4 py-3 text-sm bg-[#F5F0E8] text-[#5A5A5A] cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Return Date</label>
                <input
                  type="date"
                  value={returnDate}
                  min={minDateStr}
                  onChange={e => setReturnDate(e.target.value)}
                  required
                  className="w-full border border-[#D4CDB8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D5016] bg-white"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-[#D4CDB8] text-[#1A1A1A] py-3 rounded-full text-sm font-medium hover:bg-[#F5F0E8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={borrowing}
                  className="flex-1 bg-[#2D5016] text-white py-3 rounded-full text-sm font-semibold hover:bg-[#3D6B20] transition-colors disabled:opacity-60"
                >
                  {borrowing ? 'Processing...' : 'Confirm Borrow'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
