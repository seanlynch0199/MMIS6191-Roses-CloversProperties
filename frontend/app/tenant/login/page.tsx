'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { tenantLogin, isTenantLoggedIn } from '@/lib/api'
import Link from 'next/link'

function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <circle cx="14" cy="12" r="6" className="fill-clover-500" />
      <circle cx="26" cy="12" r="6" className="fill-clover-500" />
      <circle cx="20" cy="6" r="6" className="fill-clover-500" />
      <path d="M20 18 L20 36" className="stroke-clover-600" strokeWidth="3" strokeLinecap="round" />
      <circle cx="30" cy="28" r="5" className="fill-rose-500" />
      <circle cx="34" cy="24" r="3" className="fill-rose-400" />
    </svg>
  )
}

export default function TenantLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (typeof window !== 'undefined' && isTenantLoggedIn()) {
    router.replace('/tenant')
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await tenantLogin(email, password)
      router.replace('/tenant')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-8 border border-stone-200">
        <div className="text-center mb-8">
          <Logo className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-stone-900">Tenant Portal</h1>
          <p className="text-sm text-stone-500 mt-1">Roses &amp; Clovers Properties</p>
        </div>

        {error && (
          <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg bg-white text-stone-900 focus:ring-2 focus:ring-clover-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg bg-white text-stone-900 focus:ring-2 focus:ring-clover-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-clover-600 hover:bg-clover-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-stone-400">
          Need access?{' '}
          <Link href="/contact" className="text-clover-600 hover:underline">
            Contact your property manager
          </Link>
        </p>
      </div>
    </div>
  )
}
