import type { Metadata } from 'next'
import AllBooksClient from './AllBooksClient'
import { fetchBooks } from '@/lib/api'

export const metadata: Metadata = {
  title: 'BookNook | All Books',
}

export default async function AllBooksPage() {
  let books = []
  try {
    books = await fetchBooks()
  } catch {
    books = []
  }
  return <AllBooksClient initialBooks={books} />
}
