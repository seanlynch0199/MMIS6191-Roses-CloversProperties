'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  fetchAdminPayments,
  createPayment,
  updatePayment,
  deletePayment,
  fetchLeases,
} from '@/lib/api'
import { formatCurrency } from '@/lib/format'
import type { Payment, Lease } from '@/data/types'

const PAYMENT_TYPES = ['rent', 'deposit', 'late_fee', 'other']
const PAYMENT_STATUSES = ['completed', 'pending', 'failed', 'refunded']

function StatusBadge({ status }: { status: string }) {
  const classes: Record<string, string> = {
    completed: 'bg-clover-100 text-clover-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-stone-100 text-stone-600',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize ${classes[status] || 'bg-stone-100 text-stone-600'}`}>
      {status}
    </span>
  )
}

// ── Payment form modal ────────────────────────────────────────────────────────

function PaymentModal({
  payment,
  leases,
  onClose,
  onSaved,
}: {
  payment: Payment | null
  leases: Lease[]
  onClose: () => void
  onSaved: (p: Payment) => void
}) {
  const isNew = !payment
  const [form, setForm] = useState({
    leaseId: payment?.leaseId ?? (leases[0]?.id ?? 0),
    amount: payment?.amount ?? 0,
    paymentDate: payment?.paymentDate ?? new Date().toISOString().slice(0, 10),
    paymentType: payment?.paymentType ?? 'rent',
    status: payment?.status ?? 'completed',
    notes: payment?.notes ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'amount' || name === 'leaseId' ? Number(value) : value }))
  }

  async function handleSave() {
    if (!form.leaseId || !form.amount || !form.paymentDate) {
      setError('Lease, amount, and payment date are required')
      return
    }
    setSaving(true)
    setError('')
    try {
      let saved: Payment
      if (isNew) {
        saved = await createPayment({
          leaseId: form.leaseId,
          amount: form.amount,
          paymentDate: form.paymentDate,
          paymentType: form.paymentType,
          status: form.status,
          notes: form.notes || undefined,
        })
      } else {
        saved = await updatePayment(payment!.id, {
          amount: form.amount,
          paymentDate: form.paymentDate,
          paymentType: form.paymentType as Payment['paymentType'],
          status: form.status as Payment['status'],
          notes: form.notes || null,
        })
      }
      onSaved(saved)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">
            {isNew ? 'Record Payment' : 'Edit Payment'}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {isNew && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Lease</label>
              <select
                name="leaseId"
                value={form.leaseId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white focus:ring-2 focus:ring-clover-500 focus:border-transparent text-sm"
              >
                <option value="">Select a lease...</option>
                {leases.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.tenantName} — {l.propertyName} ({l.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Amount ($)</label>
              <input
                type="number"
                name="amount"
                min="0"
                step="0.01"
                value={form.amount || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white focus:ring-2 focus:ring-clover-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Date</label>
              <input
                type="date"
                name="paymentDate"
                value={form.paymentDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white focus:ring-2 focus:ring-clover-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Type</label>
              <select
                name="paymentType"
                value={form.paymentType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white focus:ring-2 focus:ring-clover-500 focus:border-transparent text-sm"
              >
                {PAYMENT_TYPES.map((t) => (
                  <option key={t} value={t} className="capitalize">{t.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white focus:ring-2 focus:ring-clover-500 focus:border-transparent text-sm"
              >
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Notes (optional)</label>
            <textarea
              name="notes"
              rows={2}
              value={form.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white focus:ring-2 focus:ring-clover-500 focus:border-transparent resize-y text-sm"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3 pt-1">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-clover-600 hover:bg-clover-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : isNew ? 'Record Payment' : 'Save Changes'}
          </button>
          <button onClick={onClose} className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [leases, setLeases] = useState<Lease[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Payment | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    Promise.all([fetchAdminPayments(), fetchLeases()])
      .then(([p, l]) => {
        setPayments(p)
        setLeases(l)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function handleSaved(p: Payment) {
    if (editing) {
      setPayments((prev) => prev.map((x) => (x.id === p.id ? p : x)))
    } else {
      setPayments((prev) => [p, ...prev])
    }
    setShowModal(false)
    setEditing(null)
  }

  async function handleDelete(id: number) {
    try {
      await deletePayment(id)
      setPayments((prev) => prev.filter((p) => p.id !== id))
      setDeleteConfirm(null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete payment')
    }
  }

  const totalCompleted = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Payments</h1>
          {payments.length > 0 && (
            <p className="text-sm text-stone-500 mt-1">
              {formatCurrency(totalCompleted)} total collected ({payments.filter((p) => p.status === 'completed').length} payments)
            </p>
          )}
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true) }}
          className="px-4 py-2 bg-clover-600 hover:bg-clover-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Record Payment
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex justify-between">
          <span>Error: {error}</span>
          <button onClick={load} className="font-medium hover:underline">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-400 animate-pulse">
          Loading payments...
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500">
          No payments recorded yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-100">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Tenant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Property</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 text-sm text-stone-700">{pay.paymentDate}</td>
                    <td className="px-4 py-3 text-sm text-stone-700">{pay.tenantName}</td>
                    <td className="px-4 py-3 text-sm text-stone-700">{pay.propertyName}</td>
                    <td className="px-4 py-3 text-sm text-stone-700 capitalize">{pay.paymentType.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-stone-900">{formatCurrency(pay.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={pay.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => { setEditing(pay); setShowModal(true) }}
                          className="text-sm text-clover-600 hover:text-clover-800 font-medium"
                        >
                          Edit
                        </button>
                        {deleteConfirm === pay.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(pay.id)}
                              className="text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-sm text-stone-500 hover:text-stone-700"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(pay.id)}
                            className="text-sm text-stone-400 hover:text-red-600"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <PaymentModal
          payment={editing}
          leases={leases}
          onClose={() => { setShowModal(false); setEditing(null) }}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
