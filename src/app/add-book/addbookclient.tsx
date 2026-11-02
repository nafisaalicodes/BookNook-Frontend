'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { addBook, uploadImageToImgbb } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'

const CATEGORIES = ['Fiction', 'Science', 'History', 'Kids', 'Others']

function AddBookForm() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    author: '',
    category: 'Fiction',
    description: '',
    totalCopies: '1',
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login?redirect=/add-book')
    }
  }, [session, isPending, router])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setImageUrl('')
    setUploadingImage(true)

    try {
      const url = await uploadImageToImgbb(file)
      setImageUrl(url)
      toast.success('Image uploaded!')
    } catch {
      toast.error(
        'Image upload failed. You can still add the book without an image.'
      )
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.title.trim() || !form.author.trim()) {
      toast.error('Title and author are required')
      return
    }

    if (uploadingImage) {
      toast.error('Please wait for image upload to finish')
      return
    }

    setLoading(true)

    try {
      if (!session?.user) {
        toast.error('Please log in to add a book')
        return
      }

      await addBook({
        ...form,
        totalCopies: parseInt(form.totalCopies, 10) || 1,
        image: imageUrl,
        userName: session.user.name,
        userEmail: session.user.email,
      })

      toast.success('Book added successfully! 🎉')
      router.push('/my-books')
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to add book'
      )
    } finally {
      setLoading(false)
    }
  }

  if (isPending) {
    return (
      <div className="flex justify-center py-20">
        <div className="spinner" />
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <Link
          href="/my-books"
          className="text-sm text-[#5A5A5A] hover:text-[#2D5016] transition-colors"
        >
          ← My Books
        </Link>

        <h1 className="font-serif text-4xl font-bold text-[#1A1A1A] mt-2">
          Add a New Book
        </h1>

        <p className="text-[#5A5A5A] mt-1">
          Share a book with the BookNook community.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#D4CDB8] shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book cover image */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Book Cover Image
            </label>

            <div className="flex items-start gap-4">
              <div className="w-24 h-32 bg-[#F5F0E8] rounded-xl border-2 border-dashed border-[#D4CDB8] overflow-hidden flex items-center justify-center shrink-0">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">📷</span>
                )}
              </div>

              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center gap-2 border border-[#D4CDB8] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F5F0E8] transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>

                  {uploadingImage ? 'Uploading...' : 'Choose Image'}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {imageUrl && (
                  <p className="text-xs text-green-600 mt-1.5">
                    ✓ Image uploaded successfully
                  </p>
                )}

                {!imageUrl && (
                  <p className="text-xs text-[#5A5A5A] mt-1.5">
                    Upload to imgbb (JPG, PNG, WebP)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Book title */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              Book Title <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. The Great Gatsby"
              required
              className="w-full border border-[#D4CDB8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D5016] bg-[#F5F0E8] focus:bg-white transition-colors"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              Author Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="e.g. F. Scott Fitzgerald"
              required
              className="w-full border border-[#D4CDB8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D5016] bg-[#F5F0E8] focus:bg-white transition-colors"
            />
          </div>

          {/* Category and copies */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-[#D4CDB8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D5016] bg-[#F5F0E8] focus:bg-white transition-colors"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Total Copies
              </label>

              <input
                type="number"
                name="totalCopies"
                value={form.totalCopies}
                onChange={handleChange}
                min="1"
                className="w-full border border-[#D4CDB8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D5016] bg-[#F5F0E8] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              Short Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="A brief description of the book..."
              className="w-full border border-[#D4CDB8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D5016] bg-[#F5F0E8] focus:bg-white transition-colors resize-none"
            />
          </div>

          {/* User information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5A5A5A] mb-1.5">
                Added By
              </label>

              <input
                type="text"
                value={session.user.name || ''}
                readOnly
                className="w-full border border-[#D4CDB8] rounded-xl px-4 py-3 text-sm bg-[#F5F0E8] text-[#5A5A5A] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5A5A5A] mb-1.5">
                Email
              </label>

              <input
                type="text"
                value={session.user.email || ''}
                readOnly
                className="w-full border border-[#D4CDB8] rounded-xl px-4 py-3 text-sm bg-[#F5F0E8] text-[#5A5A5A] cursor-not-allowed"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="w-full bg-[#2D5016] text-white rounded-full py-3.5 text-sm font-semibold hover:bg-[#3D6B20] transition-colors disabled:opacity-60"
          >
            {loading ? 'Adding Book...' : 'Add Book'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AddBookClient() {
  const searchParams = useSearchParams()
  const resetKey = searchParams.get('reset') ?? 'initial'

  return <AddBookForm key={resetKey} />
}
