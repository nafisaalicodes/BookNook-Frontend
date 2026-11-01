'use client'

import toast from 'react-hot-toast'

export default function NewsletterForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.success('Thanks for subscribing! 📚')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        placeholder="Your email address"
        required
        className="flex-1 border border-[#D4CDB8] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#2D5016] bg-[#F5F0E8]"
      />

      <button
        type="submit"
        className="bg-[#2D5016] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#3D6B20] transition-colors shrink-0"
      >
        Subscribe
      </button>
    </form>
  )
}
