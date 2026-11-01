import type { Metadata } from 'next'
import MyBorrowsClient from './myborrowsclient'

export const metadata: Metadata = {
  title: 'BookNook | My Borrows',
}

export default function MyBorrowsPage() {
  return <MyBorrowsClient />
}