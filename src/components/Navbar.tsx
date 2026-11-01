'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from '@/lib/auth-client'
import toast from 'react-hot-toast'
import { useRouter, usePathname  } from 'next/navigation'

export default function Navbar() {
  const { data: session, isPending } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut()
    toast.success('Logged out successfully!')
    setDropdownOpen(false)
    router.push('/')
  }

  const user = session?.user
  
const handleNavClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
) => {
  if (href === '/add-book') {
    e.preventDefault()
    setMobileOpen(false)

    router.push(`/add-book?reset=${crypto.randomUUID()}`)
  }
}


  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/books', label: 'All Books' },
    ...(user ? [
      { href: '/add-book', label: 'Add Book' },
      { href: '/my-books', label: 'My Books' },
      { href: '/my-borrows', label: 'My Borrows' },
    ] : []),
  ]

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-[#D4CDB8] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
         

<Link href="/" className="flex items-center gap-2 shrink-0">
  <div className="w-10 h-10 shrink-0 relative">
    <Image
  src="/logo.png"
  alt="BookNook Logo"
  width={40}
  height={40}
  priority
/>
  </div>

  <div className="leading-tight">
    <p className="font-bold text-[#2D5016] text-lg leading-none">
      BookNook
    </p>
    <p className="text-[10px] text-[#5A5A5A] leading-none">
      A Small Online Library
    </p>
  </div>
</Link>


          
        <div className="hidden md:flex items-center gap-6">
        {navLinks.map(link => (
  <Link
    key={link.href}
    href={link.href}
    onClick={(e) => handleNavClick(e, link.href)}
    className="text-sm font-medium text-[#1A1A1A] hover:text-[#2D5016] transition-colors"
  >
    {link.label}
  </Link>
))}
</div>

          
          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-[#D4CDB8] animate-pulse" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-[#2D5016] object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#2D5016] flex items-center justify-center text-white font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <svg className="w-4 h-4 text-[#5A5A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#D4CDB8] rounded-xl shadow-lg py-1 z-50">
                    <div className="px-4 py-3 border-b border-[#D4CDB8]">
                      <p className="font-semibold text-[#1A1A1A] text-sm truncate">{user.name}</p>
                      <p className="text-xs text-[#5A5A5A] truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/my-profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5F0E8] transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/my-books"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5F0E8] transition-colors"
                    >
                      My Books
                    </Link>
                    <Link
                      href="/my-borrows"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5F0E8] transition-colors"
                    >
                      My Borrows
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex text-sm font-medium text-[#2D5016] border border-[#2D5016] px-4 py-1.5 rounded-full hover:bg-[#2D5016] hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-[#2D5016] text-white px-4 py-1.5 rounded-full hover:bg-[#3D6B20] transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            
            <button
              className="md:hidden p-2 text-[#2D5016]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

       
         {mobileOpen && (
  <div className="md:hidden border-t border-[#D4CDB8] py-3 space-y-1">
    {navLinks.map(link => (
  <Link
    key={link.href}
    href={link.href}
    onClick={(e) => {
      handleNavClick(e, link.href)
      setMobileOpen(false)
    }}
    className="block px-3 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F5F0E8] rounded-lg transition-colors"
  >
    {link.label}
  </Link>
))}
            {!user && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#2D5016] hover:bg-[#F5F0E8] rounded-lg"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
