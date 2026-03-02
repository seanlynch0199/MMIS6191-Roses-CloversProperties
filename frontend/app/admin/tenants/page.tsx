'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTenants, createTenant, updateTenant, deleteTenant } from '@/lib/api'
import { Tenant, TenantCreate } from '@/data/types'

export default function AdminTenantsPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [error, setError] = useState('')

  const { data: tenants, isLoading, isError, error: queryError } = useQuery({
    queryKey: ['admin-tenants'],
    queryFn: fetchTenants,
    retry: false,
  })

  const createMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] })
      setIsModalOpen(false)
      setError('')
    },
    onError: (err: Error) => setError(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TenantCreate> }) => updateTenant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] })
      setIsModalOpen(false)
      setEditingTenant(null)
      setError('')
    },
    onError: (err: Error) => setError(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] })
      setDeleteConfirm(null)
    },
    onError: (err: Error) => setError(err.message),
  })

  function handleAdd() {
    setEditingTenant(null)
    setError('')
    setIsModalOpen(true)
  }

  function handleEdit(tenant: Tenant) {
    setEditingTenant(tenant)
    setError('')
    setIsModalOpen(true)
  }

  function handleSubmit(data: TenantCreate) {
    if (editingTenant) {
      updateMutation.mutate({ id: editingTenant.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Tenants</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <p className="text-sm text-stone-500">
            {tenants?.length || 0} {(tenants?.length || 0) === 1 ? 'tenant' : 'tenants'}
          </p>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors"
          >
            Add Tenant
          </button>
        </div>

        {(error || isError) && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error || (queryError instanceof Error ? queryError.message : 'Failed to load tenants')}
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center text-stone-500">
            Loading tenants...
          </div>
        ) : !tenants?.length ? (
          <div className="p-8 text-center text-stone-500 border-2 border-dashed border-stone-200 m-6 rounded-lg">
            No tenants found. Click &quot;Add Tenant&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-50">
                  <th className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Email</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Phone</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-stone-50">
                    <td className="py-3 px-6">
                      <div className="font-medium text-stone-900">
                        {tenant.firstName} {tenant.lastName}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-stone-600">
                      {tenant.email}
                    </td>
                    <td className="py-3 px-6 text-stone-600">
                      {tenant.phone || '-'}
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(tenant)}
                          className="px-3 py-1 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(tenant.id)}
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
      {isModalOpen && (
        <TenantModal
          tenant={editingTenant}
          onSave={handleSubmit}
          onClose={() => {
            setIsModalOpen(false)
            setEditingTenant(null)
            setError('')
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-stone-200">
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              Confirm Delete
            </h3>
            <p className="text-stone-600 mb-6">
              Are you sure you want to delete this tenant? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
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
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface TenantModalProps {
  tenant: Tenant | null
  onSave: (data: TenantCreate) => void
  onClose: () => void
  isLoading: boolean
}

function TenantModal({ tenant, onSave, onClose, isLoading }: TenantModalProps) {
  const [formData, setFormData] = useState<TenantCreate>({
    firstName: tenant?.firstName || '',
    lastName: tenant?.lastName || '',
    email: tenant?.email || '',
    phone: tenant?.phone || '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(formData)
  }

  const inputClass = "w-full px-4 py-2 border border-stone-300 rounded-lg bg-white text-stone-900 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
  const labelClass = "block text-sm font-medium text-stone-700 mb-1"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-900 mb-6">
          {tenant ? 'Edit Tenant' : 'Add Tenant'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name *</label>
              <input type="text" required value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Last Name *</label>
              <input type="text" required value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email *</label>
            <input type="email" required value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={inputClass} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <button type="button" onClick={onClose} disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50">
              {isLoading ? 'Saving...' : tenant ? 'Update Tenant' : 'Add Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
