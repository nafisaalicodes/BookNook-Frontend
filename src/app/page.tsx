export const instant = false
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import HeroSlider from '@/components/HeroSlider'
import BookCard from '@/components/BookCard'
import { fetchBooks } from '@/lib/api'
import Newsletterform from '@/components/Newsletterform'



export const metadata: Metadata = {
  title: 'BookNook',
  description: 'A Small Online Library',
}

const categories = [
  { name: 'Fiction', emoji: '📖', desc: 'Worlds beyond your own.', img: '/category_fiction.png' },
  { name: 'Science', emoji: '⚛️', desc: 'Curiosity, explained.', img: '/category_science.png' },
  { name: 'History', emoji: '🏛️', desc: 'Stories that shaped us.', img: '/category_history.png' },
  { name: 'Kids', emoji: '🧸', desc: 'Little readers, big imaginations.', img: '/category_kids.png' },
  { name: 'Others', emoji: '📚', desc: 'Something unexpected.', img: '/category_others.png' },
]

async function getNewArrivals() {
  try {
    return await fetchBooks({ sort: 'newest', limit: 6 })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const newArrivals = await getNewArrivals()

  return (
    <div>
      <HeroSlider />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#C8860A] uppercase mb-1">
              — FRESH OFF THE SHELF —
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">New stories to fall into.</h2>
            <p className="text-[#5A5A5A] mt-2">Meet the latest additions to our little collection. Your next favorite might be right here.</p>
          </div>
          <Link
            href="/books"
            className="hidden sm:inline-flex items-center gap-2 shrink-0 bg-[#2D5016] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#3D6B20] transition-colors"
          >
            See All Books →
          </Link>
        </div>

        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {newArrivals.map((book: Parameters<typeof BookCard>[0]['book']) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#D4CDB8]">
            <p className="text-5xl mb-3">📚</p>
            <p className="text-[#5A5A5A]">No books yet. Be the first to add one!</p>
            <Link href="/add-book" className="inline-block mt-4 bg-[#2D5016] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#3D6B20] transition-colors">
              Add a Book
            </Link>
          </div>
        )}

        <div className="sm:hidden mt-6 text-center">
          <Link href="/books" className="inline-flex items-center gap-2 bg-[#2D5016] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#3D6B20] transition-colors">
            See All Books →
          </Link>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest text-[#C8860A] uppercase mb-2">
              — FIND YOUR KIND OF STORY. —
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.name}
                href={`/books?category=${cat.name}`}
                className="group bg-[#F5F0E8] rounded-2xl p-6 text-center border border-[#D4CDB8] hover:border-[#2D5016] hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-full flex items-center justify-center border border-[#D4CDB8] group-hover:border-[#2D5016] transition-colors overflow-hidden">
                  {cat.img ? (
                    <Image src={cat.img} alt={cat.name} width={48} height={48} className="object-contain" />
                  ) : (
                    <span className="text-2xl">{cat.emoji}</span>
                  )}
                </div>
                <h3 className="font-bold text-[#1A1A1A] mb-1">{cat.name}</h3>
                <p className="text-xs text-[#5A5A5A]">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-widest text-[#C8860A] uppercase">
            — YOUR NEXT READ IS CLOSER THAN YOU THINK. —
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
          {[
            { num: '01', icon: '🔍', title: 'Discover', desc: 'Explore a growing collection of books across different genres.' },
            { num: '02', icon: '📗', title: 'Borrow', desc: 'Choose a book, confirm your borrow, and make it part of your reading journey.' },
            { num: '03', icon: '🔄', title: 'Return & Repeat', desc: 'Return your book when you\'re done and discover another story.' },
          ].map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center text-center max-w-xs px-4">
                <div className="w-16 h-16 bg-[#EDE7D8] rounded-full flex items-center justify-center text-2xl mb-3 border-2 border-[#D4CDB8] relative">
                  {step.icon}
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2D5016] text-white rounded-full text-[10px] font-bold flex items-center justify-center">{step.num}</span>
                </div>
                <h3 className="font-bold text-[#1A1A1A] mb-1">{step.title}</h3>
                <p className="text-sm text-[#5A5A5A]">{step.desc}</p>
              </div>
              {i < 2 && (
                <div className="hidden sm:block text-[#D4CDB8] text-2xl px-2">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#EDE7D8] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#F5F0E8] border border-[#D4CDB8] overflow-hidden flex flex-col lg:flex-row">
            <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
                A little space for book lovers.
              </h2>
              <p className="text-[#5A5A5A] leading-relaxed mb-6">
                Reading is more than turning pages. It&apos;s discovering new perspectives, finding comfort in familiar words, and sharing stories that stay with us.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { icon: '💡', text: 'Discover new\nperspectives.' },
                  { icon: '❤️', text: 'Make room\nfor new stories.' },
                  { icon: '👥', text: 'Share the joy\nof reading.' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <p className="text-xs text-[#5A5A5A] whitespace-pre-line">{item.text}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/books"
                className="inline-flex items-center gap-2 bg-[#2D5016] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#3D6B20] transition-colors w-fit"
              >
                Find Your Next Read →
              </Link>
            </div>
            <div className="relative lg:w-80 xl:w-96 min-h-[250px] lg:min-h-0">
              <Image
                src="/reader_by_window_photo.png"
                alt="A reader by the window"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 border border-[#D4CDB8] flex items-start gap-4 relative overflow-hidden">
            <div className="shrink-0 text-3xl">🔖</div>
            <div>
              <h3 className="font-bold text-[#1A1A1A] text-lg mb-2">Staff Note</h3>
              <blockquote className="font-serif italic text-[#5A5A5A] text-lg leading-relaxed mb-4">
                &ldquo;Books are a uniquely portable magic.&rdquo;
              </blockquote>
              <p className="text-xs text-[#5A5A5A]">— Stephen King</p>
              <Link href="/books" className="inline-block mt-4 text-sm font-semibold text-[#2D5016] hover:underline">
                Read More →
              </Link>
            </div>
            <div className="absolute right-4 bottom-2 opacity-20">
              <Image src="/open_book_botanical_illustration.png" alt="" width={100} height={80} className="object-contain" />
            </div>
          </div>

          <Newsletterform />
        </div>
      </section>
    </div>
  )
}
