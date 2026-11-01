'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { fetchBorrows, returnBook } from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

interface BorrowRecord {
  _id: string
  bookId: string
  bookTitle: string
  bookImage?: string
  userEmail: string
  userName?: string
  borrowedAt: string
  returnDate: string
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'

  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function isOverdue(returnDate: string) {
  return new Date(returnDate) < new Date()
}

export default function MyBorrowsClient() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  const userEmail = session?.user?.email

  const [borrows, setBorrows] = useState<BorrowRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [returning, setReturning] = useState<string | null>(null)
  const [confirmReturn, setConfirmReturn] =
    useState<BorrowRecord | null>(null)


  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login?redirect=/my-borrows')
    }
  }, [session?.user, isPending, router])

  useEffect(() => {
  if (isPending || !userEmail) return

  let cancelled = false

  const fetchData = async () => {
    try {
      const data = await fetchBorrows(userEmail)

      if (!cancelled) {
        setBorrows(data)
      }
    } catch {
      if (!cancelled) {
        toast.error('Failed to load borrows')
      }
    } finally {
      if (!cancelled) {
        setLoading(false)
      }
    }
  }

  void fetchData()

  return () => {
    cancelled = true
  }
}, [isPending, userEmail])

  const handleReturn = async () => {
    if (!confirmReturn) return

    setReturning(confirmReturn._id)

    try {
      await returnBook(confirmReturn._id)

      toast.success('Book returned successfully! 📚')

      setBorrows((prev) =>
        prev.filter((borrow) => borrow._id !== confirmReturn._id)
      )

      setConfirmReturn(null)
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to return book'
      )
    } finally {
      setReturning(null)
    }
  }

  if (isPending || loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-[#1A1A1A]">
            My Borrows
          </h1>
          <p className="text-[#5A5A5A] mt-1">
            Books you&apos;ve borrowed from the library.
          </p>
        </div>

        {borrows.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#D4CDB8]">
            <p className="text-5xl mb-4">📖</p>

            <h3 className="font-bold text-[#1A1A1A] text-lg mb-2">
              No borrowed books
            </h3>

            <p className="text-[#5A5A5A] text-sm mb-6">
              Browse the library and borrow your first book!
            </p>

            <Link
              href="/books"
              className="inline-flex items-center gap-2 bg-[#2D5016] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#3D6B20] transition-colors"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-2xl border border-[#D4CDB8] overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5F0E8] border-b border-[#D4CDB8]">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider">
                      Book
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider">
                      Borrow Date
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider">
                      Return Date
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider">
                      Status
                    </th>

                    <th className="text-right px-6 py-4 text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#D4CDB8]">
                  {borrows.map((borrow) => (
                    <tr
                      key={borrow._id}
                      className="hover:bg-[#F5F0E8]/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-[52px] relative shrink-0 rounded overflow-hidden bg-[#EDE7D8]">
                            {borrow.bookImage ? (
                              <Image
                                src={borrow.bookImage}
                                alt={borrow.bookTitle}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">
                                📚
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-[#1A1A1A] text-sm">
                              {borrow.bookTitle}
                            </p>

                            <Link
                              href={`/books/${borrow.bookId}`}
                              className="text-xs text-[#2D5016] hover:underline"
                            >
                              View Book →
                            </Link>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#5A5A5A]">
                        {formatDate(borrow.borrowedAt)}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <span
                          className={
                            isOverdue(borrow.returnDate)
                              ? 'text-red-500 font-semibold'
                              : 'text-[#5A5A5A]'
                          }
                        >
                          {formatDate(borrow.returnDate)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {isOverdue(borrow.returnDate) ? (
                          <span className="inline-block text-xs font-semibold bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
                            Overdue
                          </span>
                        ) : (
                          <span className="inline-block text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setConfirmReturn(borrow)}
                          className="text-xs font-semibold bg-[#EDE7D8] text-[#2D5016] px-4 py-2 rounded-full hover:bg-[#2D5016] hover:text-white transition-colors border border-[#D4CDB8] hover:border-[#2D5016]"
                        >
                          Return Book
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {borrows.map((borrow) => (
                <div
                  key={borrow._id}
                  className="bg-white rounded-2xl border border-[#D4CDB8] p-4"
                >
                  <div className="flex gap-3 mb-4">
                    <div className="w-12 h-16 relative shrink-0 rounded-lg overflow-hidden bg-[#EDE7D8]">
                      {borrow.bookImage ? (
                        <Image
                          src={borrow.bookImage}
                          alt={borrow.bookTitle}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          📚
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-[#1A1A1A]">
                        {borrow.bookTitle}
                      </p>

                      <Link
                        href={`/books/${borrow.bookId}`}
                        className="text-xs text-[#2D5016] hover:underline"
                      >
                        View Book →
                      </Link>

                      {isOverdue(borrow.returnDate) ? (
                        <p className="text-xs font-semibold text-red-500">
                          Overdue
                        </p>
                      ) : (
                        <p className="text-xs font-semibold text-green-600">
                          Active
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <p className="text-xs text-[#5A5A5A]">Borrowed</p>
                      <p className="font-medium">
                        {formatDate(borrow.borrowedAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#5A5A5A]">Return by</p>
                      <p
                        className={`font-medium ${
                          isOverdue(borrow.returnDate)
                            ? 'text-red-500'
                            : ''
                        }`}
                      >
                        {formatDate(borrow.returnDate)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setConfirmReturn(borrow)}
                    className="w-full text-sm font-semibold bg-[#EDE7D8] text-[#2D5016] py-2.5 rounded-full hover:bg-[#2D5016] hover:text-white transition-colors"
                  >
                    Return Book
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Return confirmation modal */}
      {confirmReturn && (
        <div
          className="modal-backdrop"
          onClick={() => setConfirmReturn(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="w-14 h-14 bg-[#EDE7D8] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔄</span>
            </div>

            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
              Return This Book?
            </h3>

            <p className="text-sm text-[#5A5A5A] mb-6">
              Return <strong>&ldquo;{confirmReturn.bookTitle}&rdquo;</strong>{' '}
              to the library?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmReturn(null)}
                disabled={!!returning}
                className="flex-1 border border-[#D4CDB8] text-[#1A1A1A] py-3 rounded-full text-sm font-medium hover:bg-[#F5F0E8] transition-colors disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={handleReturn}
                disabled={!!returning}
                className="flex-1 bg-[#2D5016] text-white py-3 rounded-full text-sm font-semibold hover:bg-[#3D6B20] transition-colors disabled:opacity-60"
              >
                {returning ? 'Returning...' : 'Yes, Return'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
