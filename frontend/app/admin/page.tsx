'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchDashboardStats } from '@/lib/api'
import type { DashboardStats } from '@/lib/api'

// ── helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount)

// ── Stat card ────────────────────────────────────────────────────────────────

type Accent = 'clover' | 'rose' | 'blue' | 'neutral'

function StatCard({
  label,
  value,
  accent = 'neutral',
  icon,
  note,
}: {
  label: string
  value: string | number
  accent?: Accent
  icon: React.ReactNode
  note?: string
}) {
  const iconClass: Record<Accent, string> = {
    clover: 'bg-clover-100 dark:bg-clover-900/30 text-clover-600 dark:text-clover-400',
    rose:   'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
    blue:   'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    neutral:'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300',
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 truncate">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 leading-none">
            {value}
          </p>
          {note && (
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1.5">{note}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg flex-shrink-0 ${iconClass[accent]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// ── Icons (inline to avoid extra imports) ────────────────────────────────────

const IconBuilding = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)
const IconPeople = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)
const IconDoc = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)
const IconCheck = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const IconCalendar = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

// ── Loading skeleton ──────────────────────────────────────────────────────────

function StatsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse"
          >
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse">
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-40 mb-3" />
        <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-48" />
      </div>
    </div>
  )
}

// ── Error banner ──────────────────────────────────────────────────────────────

function StatsError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 p-4 flex items-center gap-3">
      <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-sm text-rose-700 dark:text-rose-300 flex-1">
        Could not load stats — {message}
      </p>
      <button
        onClick={onRetry}
        className="text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline flex-shrink-0"
      >
        Retry
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchDashboardStats()
      .then(setStats)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>

      {/* ── Status Overview ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-4">
          Status Overview
        </h2>

        {loading ? (
          <StatsSkeleton />
        ) : error ? (
          <StatsError message={error} onRetry={loadStats} />
        ) : stats ? (
          <div className="space-y-4">
            {/* Count cards — 5-across on large screens */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard
                label="Total Properties"
                value={stats.totalProperties}
                accent="clover"
                icon={IconBuilding}
                note={`${stats.availableProperties} available`}
              />
              <StatCard
                label="Total Tenants"
                value={stats.totalTenants}
                accent="neutral"
                icon={IconPeople}
              />
              <StatCard
                label="Total Leases"
                value={stats.totalLeases}
                accent="neutral"
                icon={IconDoc}
              />
              <StatCard
                label="Active Leases"
                value={stats.activeLeases}
                accent="clover"
                icon={IconCheck}
              />
              <StatCard
                label="Upcoming Leases"
                value={stats.upcomingLeases}
                accent="blue"
                icon={IconCalendar}
              />
            </div>

            {/* Monthly Revenue — highlighted card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-clover-200 dark:border-clover-800/60 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Monthly Revenue
                  </p>
                  <p className="text-4xl font-bold text-clover-700 dark:text-clover-400 mt-1">
                    {formatCurrency(stats.monthlyRevenue)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-1.5">
                    {/* Revenue = sum of monthly_rent for active leases only */}
                    Sum of monthly rent for {stats.activeLeases}{' '}
                    {stats.activeLeases === 1 ? 'active lease' : 'active leases'}
                  </p>
                </div>
                <div className="p-3 bg-clover-100 dark:bg-clover-900/30 rounded-xl flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-clover-600 dark:text-clover-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* ── Quick Navigation ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-4">
          Manage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/properties"
            className="group block p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-clover-300 dark:hover:border-clover-700 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-clover-100 dark:bg-clover-900/30 rounded-lg">
                <svg className="w-5 h-5 text-clover-600 dark:text-clover-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-clover-600 dark:group-hover:text-clover-400 transition-colors">
                Properties
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage rental properties, availability, and pricing.
            </p>
          </Link>

          <Link
            href="/admin/tenants"
            className="group block p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-clover-300 dark:hover:border-clover-700 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
                <svg className="w-5 h-5 text-gray-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-clover-600 dark:group-hover:text-clover-400 transition-colors">
                Tenants
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              View and manage tenant information and contacts.
            </p>
          </Link>

          <Link
            href="/admin/leases"
            className="group block p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-clover-300 dark:hover:border-clover-700 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
                <svg className="w-5 h-5 text-gray-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-clover-600 dark:group-hover:text-clover-400 transition-colors">
                Leases
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Create and track lease agreements between properties and tenants.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
