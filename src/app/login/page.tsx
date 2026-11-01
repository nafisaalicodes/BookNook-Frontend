
import { Suspense } from 'react'
import LoginForm from './loginform'

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <p className="text-[#2D5016]">Loading login...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
