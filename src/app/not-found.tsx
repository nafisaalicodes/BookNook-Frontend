import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BookNook | 404 – Page Not Found',
}

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-lg">
        <div className="relative w-64 h-48 mx-auto mb-8">
          <Image
            src="/custom_404_illustration.png"
            alt="Page not found"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="font-serif text-6xl font-bold text-[#2D5016] mb-2">404</h1>
        <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-3">This page is missing!</h2>
        <p className="text-[#5A5A5A] mb-8">
          Looks like this page took an unexpected trip to the lost and found.
          Let&apos;s get you back to familiar shelves.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#2D5016] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#3D6B20] transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
