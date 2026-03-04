'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchLeases, fetchAdminProperties, fetchTenants, createLease, updateLease, deleteLease } from '@/lib/api'
import { Lease, LeaseCreate, Property, Tenant } from '@/data/types'
import { formatCurrency } from '@/lib/format'
import { useEscapeKey } from '@/hooks/useEscapeKey'

const statusColors: Record<string, string> = {
  upcoming:   'bg-blue-100 text-blue-700',
  active:     'bg-clover-100 text-clover-700',
  ended:      'bg-stone-100 text-stone-700',
  terminated: 'bg-rose-100 text-rose-700',
}

export default function AdminLeasesPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLease, setEditingLease] = useState<Lease | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const { data: leases, isLoading, isError, error: queryError } = useQuery({
    queryKey: ['admin-leases', statusFilter],
    queryFn: () => fetchLeases(statusFilter ? { status: statusFilter } : undefined),
    retry: false,
  })

  const { data: properties } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: fetchAdminProperties,
    retry: false,
  })

  const { data: tenants } = useQuery({
    queryKey: ['admin-tenants'],
    queryFn: fetchTenants,
    retry: false,
  })

  const createMutation = useMutation({
    mutationFn: createLease,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leases'] })
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] })
      setIsModalOpen(false)
      setError('')
    },
    onError: (err: Error) => setError(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<LeaseCreate> }) => updateLease(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leases'] })
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] })
      setIsModalOpen(false)
      setEditingLease(null)
      setError('')
    },
    onError: (err: Error) => setError(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteLease,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leases'] })
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] })
      setDeleteConfirm(null)
    },
    onError: (err: Error) => setError(err.message),
  })

  function handleAdd() {
    setEditingLease(null)
    setError('')
    setIsModalOpen(true)
  }

  function handleEdit(lease: Lease) {
    setEditingLease(lease)
    setError('')
    setIsModalOpen(true)
  }

  useEscapeKey(() => setDeleteConfirm(null), !!deleteConfirm)

  function handleSubmit(data: LeaseCreate) {
    if (editingLease) {
      updateMutation.mutate({ id: editingLease.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Leases</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-stone-500">
              {leases?.length || 0} {(leases?.length || 0) === 1 ? 'lease' : 'leases'}
            </p>
            <label htmlFor="lease-status-filter" className="sr-only">Filter by status</label>
            <select
              id="lease-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-stone-300 rounded-lg bg-white text-stone-900"
            >
              <option value="">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="ended">Ended</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-clover-600 hover:bg-clover-700 text-white font-medium rounded-lg transition-colors"
          >
            Add Lease
          </button>
        </div>

        {(error || isError) && (
          <div role="alert" className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error || (queryError instanceof Error ? queryError.message : 'Failed to load leases')}
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center text-stone-500">
            Loading leases...
          </div>
        ) : !leases?.length ? (
          <div className="p-8 text-center text-stone-500 border-2 border-dashed border-stone-200 m-6 rounded-lg">
            No leases found. Click &quot;Add Lease&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-50">
                  <th scope="col" className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Property</th>
                  <th scope="col" className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Tenant</th>
                  <th scope="col" className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Dates</th>
                  <th scope="col" className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Rent</th>
                  <th scope="col" className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {leases.map((lease) => (
                  <tr key={lease.id} className="hover:bg-stone-50">
                    <td className="py-3 px-6">
                      <div className="font-medium text-stone-900">
                        {lease.propertyName || `Property #${lease.propertyId}`}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-stone-600">
                      {lease.tenantName || `Tenant #${lease.tenantId}`}
                    </td>
                    <td className="py-3 px-6 text-stone-600">
                      <div>{formatDate(lease.startDate)}</div>
                      <div className="text-xs text-stone-400">to {formatDate(lease.endDate)}</div>
                    </td>
                    <td className="py-3 px-6 text-stone-900 font-medium">
                      {formatCurrency(lease.monthlyRent)}
                    </td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${statusColors[lease.status] || statusColors.ended}`}>
                        {lease.status}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(lease)}
                          aria-label={`Edit lease for ${lease.propertyName || `Property #${lease.propertyId}`}`}
                          className="px-3 py-1 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(lease.id)}
                          aria-label={`Delete lease for ${lease.propertyName || `Property #${lease.propertyId}`}`}
                          className="px-3 py-1 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && properties && tenants && (
        <LeaseModal
          lease={editingLease}
          properties={properties}
          tenants={tenants}
          onSave={handleSubmit}
          onClose={() => {
            setIsModalOpen(false)
            setEditingLease(null)
            setError('')
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-lease-title"
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-stone-200">
            <h3 id="delete-lease-title" className="text-lg font-semibold text-stone-900 mb-2">
              Confirm Delete
            </h3>
            <p className="text-stone-600 mb-6">
              Are you sure you want to delete this lease? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                autoFocus
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Lease'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface LeaseModalProps {
  lease: Lease | null
  properties: Property[]
  tenants: Tenant[]
  onSave: (data: LeaseCreate) => void
  onClose: () => void
  isLoading: boolean
}

function LeaseModal({ lease, properties, tenants, onSave, onClose, isLoading }: LeaseModalProps) {
  const [formData, setFormData] = useState<LeaseCreate>({
    propertyId: lease?.propertyId || (properties[0]?.id || 0),
    tenantId: lease?.tenantId || (tenants[0]?.id || 0),
    startDate: lease?.startDate || new Date().toISOString().split('T')[0],
    endDate: lease?.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    monthlyRent: lease?.monthlyRent || 0,
    depositAmount: lease?.depositAmount || undefined,
    status: lease?.status || 'upcoming',
  })

  useEscapeKey(onClose)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(formData)
  }

  const selectedProperty = properties.find(p => p.id === formData.propertyId)

  const inputClass = "w-full px-4 py-2 border border-stone-300 rounded-lg bg-white text-stone-900 focus:ring-2 focus:ring-clover-500 focus:border-transparent"
  const labelClass = "block text-sm font-medium text-stone-700 mb-1"

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lease-modal-title"
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-stone-200">
        <h3 id="lease-modal-title" className="text-lg font-semibold text-stone-900 mb-6">
          {lease ? 'Edit Lease' : 'Add Lease'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="lease-property" className={labelClass}>Property *</label>
            <select id="lease-property" required autoFocus value={formData.propertyId}
              onChange={(e) => {
                const propId = parseInt(e.target.value)
                const prop = properties.find(p => p.id === propId)
                setFormData({
                  ...formData,
                  propertyId: propId,
                  monthlyRent: formData.monthlyRent || prop?.monthlyRent || 0,
                  depositAmount: formData.depositAmount || prop?.depositAmount,
                })
              }}
              className={inputClass}>
              {properties.map(prop => (
                <option key={prop.id} value={prop.id}>
                  {prop.name} - {prop.city} ({prop.available ? 'Available' : 'Leased'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="lease-tenant" className={labelClass}>Tenant *</label>
            <select id="lease-tenant" required value={formData.tenantId}
              onChange={(e) => setFormData({ ...formData, tenantId: parseInt(e.target.value) })}
              className={inputClass}>
              {tenants.map(tenant => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.firstName} {tenant.lastName} ({tenant.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lease-start" className={labelClass}>Start Date *</label>
              <input id="lease-start" type="date" required value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label htmlFor="lease-end" className={labelClass}>End Date *</label>
              <input id="lease-end" type="date" required value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lease-rent" className={labelClass}>Monthly Rent *</label>
              <input id="lease-rent" type="number" required min={0} value={formData.monthlyRent}
                onChange={(e) => setFormData({ ...formData, monthlyRent: parseInt(e.target.value) || 0 })}
                placeholder={selectedProperty ? `Default: $${selectedProperty.monthlyRent}` : ''}
                className={inputClass} />
            </div>
            <div>
              <label htmlFor="lease-deposit" className={labelClass}>Deposit Amount</label>
              <input id="lease-deposit" type="number" min={0} value={formData.depositAmount || ''}
                onChange={(e) => setFormData({ ...formData, depositAmount: parseInt(e.target.value) || undefined })}
                className={inputClass} />
            </div>
          </div>

          {lease && (
            <div>
              <label htmlFor="lease-status" className={labelClass}>Status</label>
              <select id="lease-status" value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as LeaseCreate['status'] })}
                className={inputClass}>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <button type="button" onClick={onClose} disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-clover-600 hover:bg-clover-700 rounded-lg transition-colors disabled:opacity-50">
              {isLoading ? 'Saving...' : lease ? 'Update Lease' : 'Add Lease'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
