'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import {
  fetchMyBooks,
  deleteBook,
  updateBook,
  uploadImageToImgbb,
} from '@/lib/api'
import BookCard, { Book } from '@/components/BookCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'

const CATEGORIES = ['Fiction', 'Science', 'History', 'Kids', 'Others']

export default function MyBooksPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [editBook, setEditBook] = useState<Book | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null)

  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    category: '',
    description: '',
    totalCopies: '1',
  })

  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState('')
  const [editImageUrl, setEditImageUrl] = useState('')

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const userEmail = session?.user?.email


  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login?redirect=/my-books')
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (isPending || !userEmail) {
      return
    }

    let cancelled = false

    async function loadBooks() {
      try {
        const data = await fetchMyBooks(userEmail!)

        if (!cancelled) {
          setBooks(data)
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch books:', error)
          toast.error('Failed to load your books')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadBooks()

    return () => {
      cancelled = true
    }
  }, [userEmail, isPending])

  const openEdit = (book: Book) => {
    setEditBook(book)

    setEditForm({
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description || '',
      totalCopies: String(book.totalCopies || 1),
    })

    setEditImagePreview(book.image || '')
    setEditImageUrl(book.image || '')
    setEditImageFile(null)
  }

  const handleEditImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    setEditImageFile(file)
    setEditImagePreview(URL.createObjectURL(file))

    try {
      const url = await uploadImageToImgbb(file)
      setEditImageUrl(url)
    } catch {
      toast.error('Image upload failed')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editBook) return

    setSaving(true)

    try {
      await updateBook(editBook._id, {
        ...editForm,
        totalCopies: parseInt(editForm.totalCopies, 10),
        image: editImageUrl,
      })

      toast.success('Book updated successfully!')
      setEditBook(null)

      if (userEmail) {
        try {
          const data = await fetchMyBooks(userEmail)
          setBooks(data)
        } catch {
          toast.error('Book updated, but refreshing the list failed.')
        }
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'Update failed'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)

    try {
      await deleteBook(deleteTarget._id)

      toast.success('Book deleted successfully')

      setBooks((prev) =>
        prev.filter((book) => book._id !== deleteTarget._id)
      )

      setDeleteTarget(null)
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'Delete failed'
      )
    } finally {
      setDeleting(false)
    }
  }

  if (isPending || (userEmail && loading)) {
  return (
    <div className="flex justify-center py-20">
      <LoadingSpinner />
    </div>
  )
}

  if (!session?.user) return null

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold text-[#1A1A1A]">
              My Books
            </h1>

            <p className="text-[#5A5A5A] mt-1">
              Books you&apos;ve added to the library.
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex items-center gap-2 bg-[#2D5016] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#3D6B20] transition-colors"
          >
            + Add Book
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#D4CDB8]">
            <p className="text-5xl mb-4">📚</p>

            <h3 className="font-bold text-[#1A1A1A] text-lg mb-2">
              No books added yet
            </h3>

            <p className="text-[#5A5A5A] text-sm mb-6">
              Start contributing to the BookNook library!
            </p>

            <Link
              href="/add-book"
              className="inline-flex items-center gap-2 bg-[#2D5016] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#3D6B20] transition-colors"
            >
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                showEdit
                showDelete
                onEdit={() => openEdit(book)}
                onDelete={() => setDeleteTarget(book)}
              />
            ))}
          </div>
        )}
      </div>

      {editBook && (
        <div
          className="modal-backdrop"
          onClick={() => setEditBook(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-6">
              Edit Book
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Cover Image
                </label>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 bg-[#F5F0E8] rounded-lg overflow-hidden border border-[#D4CDB8] shrink-0">
                    {editImagePreview ? (
                      <Image
                        src={editImagePreview}
                        alt="Preview"
                        width={64}
                        height={80}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">
                        📷
                      </div>
                    )}
                  </div>

                  <label className="cursor-pointer text-sm text-[#2D5016] border border-[#2D5016] px-3 py-1.5 rounded-lg hover:bg-[#F5F0E8] transition-colors">
                    Change Image

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                  Title
                </label>

                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full border border-[#D4CDB8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2D5016] bg-[#F5F0E8] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                  Author
                </label>

                <input
                  type="text"
                  value={editForm.author}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      author: e.target.value,
                    }))
                  }
                  className="w-full border border-[#D4CDB8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2D5016] bg-[#F5F0E8] focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Category
                  </label>

                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full border border-[#D4CDB8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2D5016] bg-[#F5F0E8] focus:bg-white"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Copies
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={editForm.totalCopies}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        totalCopies: e.target.value,
                      }))
                    }
                    className="w-full border border-[#D4CDB8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2D5016] bg-[#F5F0E8] focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                  Description
                </label>

                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full border border-[#D4CDB8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2D5016] bg-[#F5F0E8] focus:bg-white resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditBook(null)}
                  className="flex-1 border border-[#D4CDB8] text-[#1A1A1A] py-3 rounded-full text-sm font-medium hover:bg-[#F5F0E8] transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || Boolean(editImageFile && !editImageUrl)}
                  className="flex-1 bg-[#2D5016] text-white py-3 rounded-full text-sm font-semibold hover:bg-[#3D6B20] transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="modal-backdrop"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
              Delete Book?
            </h3>

            <p className="text-sm text-[#5A5A5A] mb-6">
              Are you sure you want to delete{' '}
              <strong>&ldquo;{deleteTarget.title}&rdquo;</strong>? This cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border border-[#D4CDB8] text-[#1A1A1A] py-3 rounded-full text-sm font-medium hover:bg-[#F5F0E8] transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 text-white py-3 rounded-full text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
