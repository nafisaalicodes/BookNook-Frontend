'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp, signIn } from '@/lib/auth-client'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', photoURL: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const validatePassword = (password: string) => {
    const errs: string[] = []
    if (password.length < 6) errs.push('At least 6 characters required')
    if (!/[A-Z]/.test(password)) errs.push('Must contain an uppercase letter')
    if (!/[a-z]/.test(password)) errs.push('Must contain a lowercase letter')
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'

    const pwErrors = validatePassword(form.password)
    if (pwErrors.length > 0) newErrors.password = pwErrors.join('. ')

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const result = await signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        image: form.photoURL || undefined,
      })
      if (result.error) {
        toast.error(result.error.message || 'Registration failed')
      } else {
        toast.success('Account created! Please login. 🎉')
        router.push('/login')
      }
    } catch {
      toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await signIn.social({ provider: 'google', callbackURL: '/' })
    } catch {
      toast.error('Google signup failed')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-lg border border-[#D4CDB8] p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#2D5016] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">Create Account</h1>
          <p className="text-[#5A5A5A] mt-1 text-sm">Join BookNook and start reading today</p>
        </div>

        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 border border-[#D4CDB8] rounded-full py-3 text-sm font-medium text-[#1A1A1A] hover:bg-[#F5F0E8] transition-colors mb-6 disabled:opacity-60"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <div className="relative flex items-center mb-6">
          <div className="flex-1 border-t border-[#D4CDB8]" />
          <span className="px-3 text-xs text-[#5A5A5A]">or register with email</span>
          <div className="flex-1 border-t border-[#D4CDB8]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full border border-[#D4CDB8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D5016] bg-[#F5F0E8] focus:bg-white transition-colors"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-[#D4CDB8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D5016] bg-[#F5F0E8] focus:bg-white transition-colors"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Photo URL <span className="text-[#5A5A5A] font-normal">(optional)</span></label>
            <input
              type="url"
              name="photoURL"
              value={form.photoURL}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className="w-full border border-[#D4CDB8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D5016] bg-[#F5F0E8] focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none bg-[#F5F0E8] focus:bg-white transition-colors ${errors.password ? 'border-red-400 focus:border-red-400' : 'border-[#D4CDB8] focus:border-[#2D5016]'}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            <p className="text-xs text-[#5A5A5A] mt-1.5">Min 6 chars, one uppercase & one lowercase letter.</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D5016] text-white rounded-full py-3 text-sm font-semibold hover:bg-[#3D6B20] transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-[#5A5A5A] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#2D5016] font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  )
}
