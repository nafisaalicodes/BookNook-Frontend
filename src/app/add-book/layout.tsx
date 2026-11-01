import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'BookNook | Add Book',
}

export default function AddBookLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}