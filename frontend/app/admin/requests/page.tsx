'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchAdminRequests, updateAdminRequest } from '@/lib/api'
import type { MaintenanceRequest } from '@/data/types'

const STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed']

function StatusBadge({ status }: { status: string }) {
  const classes: Record<string, string> = {
    open: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-clover-100 text-clover-700',
    closed: 'bg-stone-100 text-stone-600',
  }
  const labels: Record<string, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${classes[status] || 'bg-stone-100 text-stone-600'}`}>
      {labels[status] || status}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const classes: Record<string, string> = {
    low: 'bg-stone-100 text-stone-600',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize ${classes[priority] || 'bg-stone-100 text-stone-600'}`}>
      {priority}
    </span>
  )
}

// ── Edit modal ────────────────────────────────────────────────────────────────

function EditModal({
  req,
  onClose,
  onSave,
}: {
  req: MaintenanceRequest
  onClose: () => void
  onSave: (updated: MaintenanceRequest) => void
}) {
  const [status, setStatus] = useState(req.status)
  const [adminNotes, setAdminNotes] = useState(req.adminNotes ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const updated = await updateAdminRequest(req.id, {
        status,
        adminNotes: adminNotes || null,
      })
      onSave(updated)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">{req.title}</h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {req.tenantName} &middot; {req.propertyName} &middot; {req.category.replace('_', ' ')}
            </p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3 bg-stone-50 rounded-lg text-sm text-stone-700">
          {req.description}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MaintenanceRequest['status'])}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white focus:ring-2 focus:ring-clover-500 focus:border-transparent"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Admin Notes (visible to tenant)</label>
          <textarea
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Optional notes for the tenant about this request..."
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white focus:ring-2 focus:ring-clover-500 focus:border-transparent resize-y"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-clover-600 hover:bg-clover-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [editing, setEditing] = useState<MaintenanceRequest | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchAdminRequests(statusFilter ? { status: statusFilter } : undefined)
      .then(setRequests)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [statusFilter])

  useEffect(() => {
    load()
  }, [load])

  function handleSaved(updated: MaintenanceRequest) {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    setEditing(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-stone-900">Maintenance Requests</h1>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-700 bg-white focus:ring-2 focus:ring-clover-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex justify-between">
          <span>Error: {error}</span>
          <button onClick={load} className="font-medium hover:underline">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-400 animate-pulse">
          Loading requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500">
          No maintenance requests found.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-100">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Request</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Tenant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Property</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Submitted</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-stone-900">{req.title}</p>
                      <p className="text-xs text-stone-400 capitalize">{req.category.replace('_', ' ')}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-700">{req.tenantName}</td>
                    <td className="px-4 py-3 text-sm text-stone-700">{req.propertyName}</td>
                    <td className="px-4 py-3"><PriorityBadge priority={req.priority} /></td>
                    <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                    <td className="px-4 py-3 text-xs text-stone-400">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditing(req)}
                        className="text-sm text-clover-600 hover:text-clover-800 font-medium"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <EditModal req={editing} onClose={() => setEditing(null)} onSave={handleSaved} />
      )}
    </div>
  )
}
