'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchMyLease, fetchMyRequests, fetchMyPayments } from '@/lib/api'
import { formatCurrency } from '@/lib/format'
import type { Lease, MaintenanceRequest, Payment } from '@/data/types'

// ── Status badge helpers ──────────────────────────────────────────────────────

function RequestStatusBadge({ status }: { status: string }) {
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
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${classes[status] || 'bg-stone-100 text-stone-600'}`}>
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
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${classes[priority] || 'bg-stone-100 text-stone-600'}`}>
      {priority}
    </span>
  )
}

function PaymentStatusBadge({ status }: { status: string }) {
  const classes: Record<string, string> = {
    completed: 'bg-clover-100 text-clover-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-stone-100 text-stone-600',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${classes[status] || 'bg-stone-100 text-stone-600'}`}>
      {status}
    </span>
  )
}

function LeaseStatusBadge({ status }: { status: string }) {
  const classes: Record<string, string> = {
    active: 'bg-clover-100 text-clover-700',
    upcoming: 'bg-blue-100 text-blue-700',
    ended: 'bg-stone-100 text-stone-600',
    terminated: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${classes[status] || 'bg-stone-100 text-stone-600'}`}>
      {status}
    </span>
  )
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-stone-200 rounded animate-pulse ${className}`} />
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TenantDashboardPage() {
  const [lease, setLease] = useState<Lease | null | undefined>(undefined)
  const [requests, setRequests] = useState<MaintenanceRequest[] | null>(null)
  const [payments, setPayments] = useState<Payment[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    Promise.all([fetchMyLease(), fetchMyRequests(), fetchMyPayments()])
      .then(([l, r, p]) => {
        setLease(l)
        setRequests(r)
        setPayments(p)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-stone-900">My Dashboard</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between">
          <span>Could not load your data — {error}</span>
          <button onClick={load} className="font-medium hover:underline ml-4">Retry</button>
        </div>
      )}

      {/* ── Lease Info ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">Current Lease</h2>
        {loading ? (
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        ) : lease === null || lease === undefined ? (
          <div className="bg-white rounded-xl border border-stone-200 p-6 text-stone-500 text-sm">
            No active lease found.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-clover-200 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-stone-900">{lease.propertyName}</h3>
                  <LeaseStatusBadge status={lease.status} />
                </div>
                <p className="text-sm text-stone-500">
                  {lease.startDate} &ndash; {lease.endDate}
                </p>
                {lease.paymentDueDay && (
                  <p className="text-sm text-stone-500 mt-1">
                    Rent due on the {lease.paymentDueDay}{ordinalSuffix(lease.paymentDueDay)} of each month
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-clover-700">{formatCurrency(lease.monthlyRent)}</p>
                <p className="text-xs text-stone-400">per month</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Maintenance Requests ───────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Maintenance Requests</h2>
          <Link
            href="/tenant/requests/new"
            className="px-3 py-1.5 text-xs font-medium bg-clover-600 hover:bg-clover-700 text-white rounded-lg transition-colors"
          >
            + New Request
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        ) : !requests || requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-6 text-center">
            <p className="text-stone-500 text-sm mb-3">No maintenance requests yet.</p>
            <Link
              href="/tenant/requests/new"
              className="text-sm font-medium text-clover-600 hover:underline"
            >
              Submit your first request
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
            {requests.map((req) => (
              <div key={req.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-stone-900 text-sm truncate">{req.title}</p>
                    <p className="text-xs text-stone-400 mt-0.5 capitalize">
                      {req.category.replace('_', ' ')} &middot; {new Date(req.createdAt!).toLocaleDateString()}
                    </p>
                    {req.adminNotes && (
                      <p className="text-xs text-stone-600 mt-1 italic">
                        Admin note: {req.adminNotes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <PriorityBadge priority={req.priority} />
                    <RequestStatusBadge status={req.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Payment History ────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">Payment History</h2>

        {loading ? (
          <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : !payments || payments.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-6 text-stone-500 text-sm">
            No payment history yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-stone-100">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-stone-50">
                      <td className="px-4 py-3 text-sm text-stone-700">{pay.paymentDate}</td>
                      <td className="px-4 py-3 text-sm text-stone-700 capitalize">{pay.paymentType.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-sm font-medium text-stone-900">{formatCurrency(pay.amount)}</td>
                      <td className="px-4 py-3"><PaymentStatusBadge status={pay.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function ordinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}
