'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession, authClient } from '@/lib/auth-client'
import LoadingSpinner from '@/components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function MyProfilePage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace('/login?redirect=/my-profile')
    }
  }, [isPending, session, router])

  if (isPending) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const user = session.user

  const handleEdit = () => {
    setName(user.name || '')
    setIsEditing(true)
  }

  const handleCancel = () => {
    setName(user.name || '')
    setIsEditing(false)
  }

  const handleUpdateName = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const updatedName = name.trim()

    if (updatedName.length < 2) {
      toast.error('Name must contain at least 2 characters.')
      return
    }

    if (updatedName.length > 100) {
      toast.error('Name cannot exceed 100 characters.')
      return
    }

    if (updatedName === user.name) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)

    try {
      const result = await authClient.updateUser({
        name: updatedName,
      })

      if (result.error) {
        toast.error(result.error.message || 'Failed to update your name.')
        return
      }

      toast.success('Name updated successfully!')
      setIsEditing(false)

      await authClient.getSession()
      router.refresh()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)

    try {
      await authClient.signOut()
      toast.success('Signed out successfully!')
      router.replace('/')
      router.refresh()
    } catch {
      toast.error('Failed to sign out. Please try again.')
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#2D5016]">
            BookNook Account
          </p>

          <h1 className="font-serif text-4xl font-bold text-[#1A1A1A] sm:text-5xl">
            My Profile
          </h1>

          <p className="mt-3 text-[#5A5A5A]">
            View and manage your account information.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#D4CDB8] bg-white shadow-sm">
          <div className="bg-[#2D5016] px-6 py-10 text-center sm:px-10">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || 'User profile'}
                width={112}
                height={112}
                className="mx-auto mb-4 h-28 w-28 rounded-full border-4 border-[#F5F0E8] object-cover"
              />
            ) : (
              <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#F5F0E8] bg-[#F5F0E8] text-4xl font-bold text-[#2D5016]">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}

            <h2 className="font-serif text-2xl font-bold text-white">
              {user.name || 'BookNook User'}
            </h2>

            <p className="mt-2 break-all text-sm text-[#F5F0E8]">
              {user.email}
            </p>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="mt-6 rounded-full border border-white/50 px-6 py-2.5 font-semibold text-white transition hover:bg-white hover:text-[#2D5016] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningOut ? 'log out...' : '↪ log Out'}
            </button>
          </div>

          <div className="p-6 sm:p-10">
            <h3 className="mb-6 font-serif text-2xl font-bold text-[#1A1A1A]">
              Information
            </h3>

            <div className="rounded-2xl bg-[#F5F0E8] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#5A5A5A]">
                    Name
                  </p>

                  {!isEditing && (
                    <p className="break-words font-medium text-[#1A1A1A]">
                      {user.name || 'Not provided'}
                    </p>
                  )}
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="rounded-full border border-[#2D5016] bg-white px-5 py-2 text-sm font-semibold text-[#2D5016] transition hover:bg-[#2D5016] hover:text-white"
                  >
                    ✏️ Update
                  </button>
                )}
              </div>

              {isEditing && (
                <form onSubmit={handleUpdateName} className="mt-4">
                  <label
                    htmlFor="profile-name"
                    className="mb-2 block text-sm font-medium text-[#1A1A1A]"
                  >
                    Full Name
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    minLength={2}
                    maxLength={100}
                    required
                    autoFocus
                    className="w-full rounded-xl border border-[#D4CDB8] bg-white px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/20"
                  />

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="rounded-full bg-[#2D5016] px-6 py-2.5 font-semibold text-white transition hover:bg-[#1E3810] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="rounded-full border border-[#D4CDB8] bg-white px-6 py-2.5 font-semibold text-[#5A5A5A] transition hover:bg-[#EAE3D5] disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="mt-4 rounded-2xl bg-[#F5F0E8] p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#5A5A5A]">
                Email Address
              </p>

              <p className="break-all font-medium text-[#1A1A1A]">
                {user.email || 'Not provided'}
              </p>

              <p className="mt-2 text-xs text-[#5A5A5A]">
                Your email address cannot be changed here.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => router.push('/my-books')}
            className="rounded-2xl border border-[#D4CDB8] bg-white p-5 text-left transition hover:border-[#2D5016] hover:shadow-sm"
          >
            <span className="font-serif text-xl font-bold text-[#2D5016]">
              My Books
            </span>

            <p className="mt-1 text-sm text-[#5A5A5A]">
              Manage the books you have added.
            </p>
          </button>

          <button
            type="button"
            onClick={() => router.push('/my-borrows')}
            className="rounded-2xl border border-[#D4CDB8] bg-white p-5 text-left transition hover:border-[#2D5016] hover:shadow-sm"
          >
            <span className="font-serif text-xl font-bold text-[#2D5016]">
              My Borrows
            </span>

            <p className="mt-1 text-sm text-[#5A5A5A]">
              View and manage your borrowed books.
            </p>
          </button>
        </div>
      </div>
    </main>
  )
}