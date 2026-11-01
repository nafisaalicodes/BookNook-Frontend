'use client'

import toast from 'react-hot-toast'

export default function NewsletterForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.success('Thanks for subscribing! 📚')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2.5">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="Your email address"
        required
        className="h-12 w-full min-w-0 flex-1 rounded-full border border-[#D4CDB8] bg-[#F5F0E8] px-5 text-sm text-[#1A1A1A] transition-all duration-300 placeholder:text-[#5A5A5A] focus:border-[#C8860A] focus:outline-none focus:ring-2 focus:ring-[rgba(200,134,10,0.4)]"
      />

      <button
        type="submit"
        className="h-12 shrink-0 rounded-full bg-[#C8860A] px-7 text-sm font-bold tracking-wide text-white shadow-[0_14px_28px_-16px_rgba(200,134,10,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E09B12] active:translate-y-0"
      >
        Subscribe
      </button>
    </form>
  )
}
