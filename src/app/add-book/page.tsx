import { Suspense } from 'react'
import AddBookClient from './addbookclient'

export default function AddBookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="spinner" />
        </div>
      }
    >
      <AddBookClient />
    </Suspense>
  )
}