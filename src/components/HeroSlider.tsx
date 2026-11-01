'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Link from 'next/link'
import Image from 'next/image'

const slides = [
  {
    tag: 'YOUR NEXT CHAPTER STARTS HERE',
    title: 'Find a story that feels like home.',
    desc: 'Discover little known gems, timeless classics, and stories waiting to become your new favorites.',
    img: '/cozy_library_hero_photo.png',
   
  },
  {
    tag: 'EXPLORE THE COLLECTION',
    title: 'Every book is a new adventure.',
    desc: 'From science to fiction, history to kids — find the genre that speaks to your soul.',
    img: '/stack_of_books_photo.png',
    
  },
  {
    tag: 'BORROW & RETURN EASILY',
    title: 'Reading made simple and joyful.',
    desc: 'Borrow any book in seconds, read at your own pace, and return when you\'re done.',
    img: '/reader_by_window_photo.png',
    
  },
]

export default function HeroSlider() {
  return (
    <section className="relative">
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        pagination={{ clickable: true }}
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="hero-swiper"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative min-h-[520px] sm:min-h-[560px] bg-[#EDE7D8] overflow-hidden">
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.img}
                  alt={slide.title}
                  fill
                  className="object-cover object-center opacity-40"
                  priority={i === 0}
                />
              </div>

              <div className="absolute left-0 bottom-0 z-10 opacity-20 pointer-events-none hidden lg:block">
                <Image src="/bookshelf_botanical_illustration.png" alt="" width={200} height={300} className="object-contain" />
              </div>

              <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-20 flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1 max-w-lg">
                  <span className="inline-block text-xs font-semibold tracking-widest text-[#2D5016] border border-[#2D5016] px-3 py-1 rounded-full mb-4">
                    {slide.tag}
                  </span>
                  <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1A1A1A] leading-tight mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-[#5A5A5A] leading-relaxed mb-6">{slide.desc}</p>
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-2 bg-[#2D5016] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#3D6B20] transition-colors"
                  >
                    Browse Books →
                  </Link>
                </div>

                
              </div>

              <div className="pb-8" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
