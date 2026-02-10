'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login, getToken } from '@/lib/api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (getToken()) {
      router.replace('/admin/dashboard')
    }
  }, [router])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(password)
      router.replace('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <svg className="w-12 h-12" viewBox="0 0 40 40" fill="none">
            <circle cx="14" cy="12" r="6" className="fill-clover-500" />
            <circle cx="26" cy="12" r="6" className="fill-clover-500" />
            <circle cx="20" cy="6" r="6" className="fill-clover-500" />
            <path d="M20 18 L20 36" className="stroke-clover-600" strokeWidth="3" strokeLinecap="round" />
            <circle cx="30" cy="28" r="5" className="fill-rose-500" />
            <circle cx="34" cy="24" r="3" className="fill-rose-400" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-1">
          Admin Login
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Roses & Clovers Properties
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              disabled={isLoading}
              autoFocus
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-clover-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-clover-600 hover:bg-clover-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
