import Link from 'next/link'
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#1A2E0D] text-white mt-auto">
   
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden">
  <Image
    src="/logo.png"
    alt="BookNook Logo"
    width={36}
    height={36}
    className="object-contain"
  />
</div>
              <div>
                <p className="font-bold text-white text-lg leading-none">BookNook</p>
                <p className="text-[10px] text-[#A8B8A0] leading-none">A Small Online Library</p>
              </div>
            </div>
            <p className="text-sm text-[#A8B8A0] mt-3 leading-relaxed">
              Discover books, share stories, and make room for your next favorite read.
            </p>
           
            <div className="flex items-center gap-3 mt-4">
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-[#2D5016] hover:bg-[#C8860A] flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-[#2D5016] hover:bg-[#C8860A] flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1.5"/>
                </svg>
              </a>
              <a href="#" aria-label="X (Twitter)" className="w-8 h-8 rounded-full bg-[#2D5016] hover:bg-[#C8860A] flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

         
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/books', label: 'All Books' },
                { href: '/add-book', label: 'Add Book' },
                { href: '/my-books', label: 'My Books' },
                { href: '/my-borrows', label: 'My Borrows' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#A8B8A0] hover:text-[#C8860A] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-[#A8B8A0]">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#C8860A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                hello@booknook.com
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#C8860A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Dhaka, Bangladesh
              </li>
            </ul>
          </div>

          
          <div>
            <h4 className="font-semibold text-white mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-sm text-[#A8B8A0]">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#C8860A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Mon – Sat: 9AM – 7PM
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#C8860A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sun: 10AM – 6PM
              </li>
            </ul>
          </div>
        </div>
      </div>

      
      <div className="border-t border-[#2D5016]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#A8B8A0]">© 2026 BookNook. Made for the love of reading.</p>
          <div className="flex items-center gap-4 text-xs text-[#A8B8A0]">
            <Link href="/" className="hover:text-[#C8860A] transition-colors">Home</Link>
            <Link href="/books" className="hover:text-[#C8860A] transition-colors">All Books</Link>
            <Link href="/add-book" className="hover:text-[#C8860A] transition-colors">Add Book</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
