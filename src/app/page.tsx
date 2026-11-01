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

      <section className="bg-[#EDE7D8] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">   
        <div className="flex flex-col overflow-hidden rounded-[2rem] border border-[#D4CDB8] bg-[#F5F0E8] shadow-[0_30px_60px_-45px_rgba(26,46,13,0.6)] lg:flex-row">
            <div className="relative flex-1 p-7 sm:p-10 lg:p-14">
              <Image
                src="/bookshelf_botanical_illustration.png"
                alt=""
                width={190}
                height={280}
                className="pointer-events-none absolute bottom-4 right-4 hidden opacity-[0.14] mix-blend-multiply lg:block"
              />

              <div className="relative">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#C8860A]">
                  — Pull up a chair —
                </p>

                <h2 className="font-serif text-[2rem] font-bold leading-[1.12] tracking-tight text-[#1A1A1A] sm:text-4xl lg:text-[2.75rem]">
                  A little space for <span className="italic text-[#2D5016]">book lovers</span>.
                </h2>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5A5A5A] sm:text-[17px]">
                  Reading is more than turning pages. It&apos;s discovering new perspectives, finding comfort in familiar words, and sharing stories that stay with us.
                </p>

                <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: '💡', text: 'Discover new perspectives.' },
                    { icon: '❤️', text: 'Make room for new stories.' },
                    { icon: '👥', text: 'Share the joy of reading.' },
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="group/point flex items-center gap-3 rounded-2xl border border-[#D4CDB8] bg-white/60 px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(45,80,22,0.45)] hover:bg-white hover:shadow-[0_16px_30px_-24px_rgba(26,46,13,0.9)]"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#D4CDB8] bg-[#EDE7D8] text-lg leading-none transition-colors duration-300 group-hover/point:border-[rgba(200,134,10,0.65)]">
                        {item.icon}
                      </span>
                      <span className="text-[13px] font-semibold leading-snug text-[#5A5A5A]">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/books"
                  className="group/cta mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#2D5016] px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_16px_30px_-18px_rgba(45,80,22,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3D6B20] hover:shadow-[0_20px_38px_-18px_rgba(45,80,22,0.9)] active:translate-y-0"
                >
                  Find Your Next Read
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover/cta:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>

<div className="relative min-h-[260px] w-full flex-shrink-0 overflow-hidden sm:min-h-[340px] lg:min-h-0 lg:w-[42%] lg:self-stretch xl:w-[44%]">
  <Image
    src="/Reader.png"
    alt="A reader by the window"
    fill
    sizes="(min-width: 1280px) 44vw, (min-width: 1024px) 42vw, 100vw"
    className="object-cover object-center"
  />

  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0"
    style={{
      background:
        'linear-gradient(to top, rgba(26,46,13,0.32), rgba(26,46,13,0) 45%)',
    }}
  />

  <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-px bg-[#D4CDB8] lg:block" />
</div>

</div>
</div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <article className="group relative flex flex-col justify-center overflow-hidden rounded-3xl border border-[#D4CDB8] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(45,80,22,0.45)] hover:shadow-[0_30px_55px_-40px_rgba(26,46,13,0.75)] sm:p-9">
            <div className="relative z-10 flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#D4CDB8] bg-[#F5F0E8] text-xl leading-none transition-colors duration-300 group-hover:border-[rgba(200,134,10,0.65)]">
                🔖
              </span>
              <div className="min-w-0">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                  Staff Note
                </h3>
                <blockquote className="font-serif text-xl italic leading-snug text-[#1A2E0D] sm:text-2xl">
                  &ldquo;Books are a uniquely portable magic.&rdquo;
                </blockquote>
                <p className="mt-3 text-xs font-semibold tracking-wide text-[#5A5A5A]">
                  — Stephen King
                </p>
                <Link
                  href="/books"
                  className="group/link mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#2D5016] transition-colors duration-300 hover:text-[#C8860A]"
                >
                  Read More
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover/link:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>

            <Image
              src="/open_book_botanical_illustration.png"
              alt=""
              width={132}
              height={106}
              className="pointer-events-none absolute -bottom-3 -right-3 opacity-[0.2] mix-blend-multiply transition-opacity duration-300 group-hover:opacity-35"
            />
          </article>

          <div className="relative flex flex-col justify-center overflow-hidden rounded-3xl border border-[#2D5016] bg-[#1A2E0D] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_55px_-40px_rgba(26,46,13,0.9)] sm:p-9">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(200,134,10,0.35) 0%, rgba(200,134,10,0) 70%)' }}
            />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C8860A]">
                — Newsletter —
              </p>
              <h3 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">
                Stay in the loop.
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#A8B8A0]">
                New arrivals and quiet recommendations, right in your inbox.
              </p>
              <div className="mt-6">
                <Newsletterform />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
