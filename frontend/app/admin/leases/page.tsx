'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchLeases, fetchAdminProperties, fetchTenants, createLease, updateLease, deleteLease } from '@/lib/api'
import { Lease, LeaseCreate, Property, Tenant } from '@/data/types'

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  ended: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  terminated: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Leases</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {leases?.length || 0} {(leases?.length || 0) === 1 ? 'lease' : 'leases'}
            </p>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Add Lease
          </button>
        </div>

        {(error || isError) && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error || (queryError instanceof Error ? queryError.message : 'Failed to load leases')}
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Loading leases...
          </div>
        ) : !leases?.length ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 m-6 rounded-lg">
            No leases found. Click &quot;Add Lease&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50">
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Property</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tenant</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dates</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rent</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leases.map((lease) => (
                  <tr key={lease.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                    <td className="py-3 px-6">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {lease.propertyName || `Property #${lease.propertyId}`}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-gray-600 dark:text-gray-400">
                      {lease.tenantName || `Tenant #${lease.tenantId}`}
                    </td>
                    <td className="py-3 px-6 text-gray-600 dark:text-gray-400">
                      <div>{formatDate(lease.startDate)}</div>
                      <div className="text-xs text-gray-400">to {formatDate(lease.endDate)}</div>
                    </td>
                    <td className="py-3 px-6 text-gray-900 dark:text-white font-medium">
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
                          className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(lease.id)}
                          className="px-3 py-1 text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition-colors"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this lease? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(formData)
  }

  // Get selected property rent as default
  const selectedProperty = properties.find(p => p.id === formData.propertyId)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {lease ? 'Edit Lease' : 'Add Lease'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Property *
            </label>
            <select
              required
              value={formData.propertyId}
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {properties.map(prop => (
                <option key={prop.id} value={prop.id}>
                  {prop.name} - {prop.city} ({prop.available ? 'Available' : 'Leased'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tenant *
            </label>
            <select
              required
              value={formData.tenantId}
              onChange={(e) => setFormData({ ...formData, tenantId: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {tenants.map(tenant => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.firstName} {tenant.lastName} ({tenant.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Rent *
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.monthlyRent}
                onChange={(e) => setFormData({ ...formData, monthlyRent: parseInt(e.target.value) || 0 })}
                placeholder={selectedProperty ? `Default: $${selectedProperty.monthlyRent}` : ''}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deposit Amount
              </label>
              <input
                type="number"
                min={0}
                value={formData.depositAmount || ''}
                onChange={(e) => setFormData({ ...formData, depositAmount: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {lease && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as LeaseCreate['status'] })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : lease ? 'Update Lease' : 'Add Lease'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
