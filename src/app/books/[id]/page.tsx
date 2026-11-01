import type { Metadata } from 'next'
import { fetchBook } from '@/lib/api'
import BookDetailClient from './BookDetailClient'
export const instant = false

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params
    const book = await fetchBook(id)
    return { title: `BookNook | ${book.title}` }
  } catch {
    return { title: 'BookNook | Book Details' }
  }
}

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params
  let book = null
  try {
    book = await fetchBook(id)
  } catch {
    book = null
  }
  return <BookDetailClient book={book} />
}
