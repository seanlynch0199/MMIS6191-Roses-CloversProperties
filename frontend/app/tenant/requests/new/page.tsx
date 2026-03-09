'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitRequest } from '@/lib/api'

const CATEGORIES = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'Heating / Cooling (HVAC)' },
  { value: 'appliance', label: 'Appliance' },
  { value: 'structural', label: 'Structural' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'other', label: 'Other' },
]

const PRIORITIES = [
  { value: 'low', label: 'Low — Not urgent, minor inconvenience' },
  { value: 'medium', label: 'Medium — Needs attention soon' },
  { value: 'high', label: 'High — Significantly affects daily life' },
  { value: 'urgent', label: 'Urgent — Immediate danger or major damage' },
]

export default function NewRequestPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    category: 'other',
    priority: 'medium',
    description: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await submitRequest(form)
      router.push('/tenant')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Submit a Maintenance Request</h1>
        <p className="text-sm text-stone-500 mt-1">
          Describe the issue and we&apos;ll get back to you as soon as possible.
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 p-6 space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            autoFocus
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Kitchen sink is leaking"
            className="w-full px-4 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white focus:ring-2 focus:ring-clover-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-stone-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white focus:ring-2 focus:ring-clover-500 focus:border-transparent"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-stone-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white focus:ring-2 focus:ring-clover-500 focus:border-transparent"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            value={form.description}
            onChange={handleChange}
            placeholder="Please describe the issue in detail. Include when it started, how severe it is, and any relevant context."
            className="w-full px-4 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white focus:ring-2 focus:ring-clover-500 focus:border-transparent resize-y"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-clover-600 hover:bg-clover-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/tenant')}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
