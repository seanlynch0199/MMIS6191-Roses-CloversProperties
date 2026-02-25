'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin, isLoggedIn } from '@/lib/api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // If already logged in, redirect
  if (typeof window !== 'undefined' && isLoggedIn()) {
    router.replace('/admin')
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await adminLogin(password)
      router.replace('/admin')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-sm w-full p-8">
        <div className="text-center mb-8">
          <svg className="w-12 h-12 mx-auto mb-4" viewBox="0 0 40 40" fill="none">
            <circle cx="14" cy="12" r="6" className="fill-clover-500" />
            <circle cx="26" cy="12" r="6" className="fill-clover-500" />
            <circle cx="20" cy="6" r="6" className="fill-clover-500" />
            <path d="M20 18 L20 36" className="stroke-clover-600" strokeWidth="3" strokeLinecap="round" />
            <circle cx="30" cy="28" r="5" className="fill-rose-500" />
            <circle cx="34" cy="24" r="3" className="fill-rose-400" />
          </svg>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Admin Login</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Roses &amp; Clovers Properties
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-clover-500 focus:border-transparent"
              placeholder="Enter admin password"
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
      </div>
    </div>
  )
}
