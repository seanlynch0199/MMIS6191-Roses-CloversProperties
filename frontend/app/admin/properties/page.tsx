'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAdminProperties, createProperty, updateProperty, deleteProperty } from '@/lib/api'
import { Property, PropertyCreate } from '@/data/types'
import { formatCurrency } from '@/lib/format'
import { useEscapeKey } from '@/hooks/useEscapeKey'

const propertyTypes = ['apartment', 'house', 'duplex', 'condo', 'townhouse', 'studio']

export default function AdminPropertiesPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [error, setError] = useState('')

  const { data: properties, isLoading, isError, error: queryError } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: fetchAdminProperties,
    retry: false,
  })

  const createMutation = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] })
      setIsModalOpen(false)
      setError('')
    },
    onError: (err: Error) => setError(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PropertyCreate> }) => updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] })
      setIsModalOpen(false)
      setEditingProperty(null)
      setError('')
    },
    onError: (err: Error) => setError(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] })
      setDeleteConfirm(null)
    },
    onError: (err: Error) => setError(err.message),
  })

  function handleAdd() {
    setEditingProperty(null)
    setError('')
    setIsModalOpen(true)
  }

  function handleEdit(property: Property) {
    setEditingProperty(property)
    setError('')
    setIsModalOpen(true)
  }

  function handleSubmit(data: PropertyCreate) {
    if (editingProperty) {
      updateMutation.mutate({ id: editingProperty.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  useEscapeKey(() => setDeleteConfirm(null), !!deleteConfirm)

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Properties</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <p className="text-sm text-stone-500">
            {properties?.length || 0} {(properties?.length || 0) === 1 ? 'property' : 'properties'}
          </p>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-clover-600 hover:bg-clover-700 text-white font-medium rounded-lg transition-colors"
          >
            Add Property
          </button>
        </div>

        {(error || isError) && (
          <div role="alert" className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error || (queryError instanceof Error ? queryError.message : 'Failed to load properties')}
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center text-stone-500">
            Loading properties...
          </div>
        ) : !properties?.length ? (
          <div className="p-8 text-center text-stone-500 border-2 border-dashed border-stone-200 m-6 rounded-lg">
            No properties found. Click &quot;Add Property&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-50">
                  <th scope="col" className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Property</th>
                  <th scope="col" className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Beds/Baths</th>
                  <th scope="col" className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Rent</th>
                  <th scope="col" className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="text-left py-3 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-stone-50">
                    <td className="py-3 px-6">
                      <div className="font-medium text-stone-900">{property.name}</div>
                      <div className="text-sm text-stone-500">{property.city}, {property.state}</div>
                    </td>
                    <td className="py-3 px-6 text-stone-600 capitalize">
                      {property.propertyType}
                    </td>
                    <td className="py-3 px-6 text-stone-600">
                      {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`} / {property.bathrooms} bath
                    </td>
                    <td className="py-3 px-6 text-stone-900 font-medium">
                      {formatCurrency(property.monthlyRent)}
                    </td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        property.available
                          ? 'bg-clover-100 text-clover-700'
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {property.available ? 'Available' : 'Leased'}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(property)}
                          aria-label={`Edit ${property.name}`}
                          className="px-3 py-1 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(property.id)}
                          aria-label={`Delete ${property.name}`}
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
        <PropertyModal
          property={editingProperty}
          onSave={handleSubmit}
          onClose={() => {
            setIsModalOpen(false)
            setEditingProperty(null)
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
          aria-labelledby="delete-property-title"
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-stone-200">
            <h3 id="delete-property-title" className="text-lg font-semibold text-stone-900 mb-2">
              Confirm Delete
            </h3>
            <p className="text-stone-600 mb-6">
              Are you sure you want to delete this property? This action cannot be undone.
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
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Property'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface PropertyModalProps {
  property: Property | null
  onSave: (data: PropertyCreate) => void
  onClose: () => void
  isLoading: boolean
}

function PropertyModal({ property, onSave, onClose, isLoading }: PropertyModalProps) {
  const [formData, setFormData] = useState<PropertyCreate>({
    name: property?.name || '',
    addressLine1: property?.addressLine1 || '',
    addressLine2: property?.addressLine2 || '',
    city: property?.city || '',
    state: property?.state || '',
    zip: property?.zip || '',
    propertyType: property?.propertyType || 'apartment',
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    squareFeet: property?.squareFeet || undefined,
    description: property?.description || '',
    amenities: property?.amenities || [],
    monthlyRent: property?.monthlyRent || 0,
    depositAmount: property?.depositAmount || undefined,
    available: property?.available ?? true,
  })

  const [amenityInput, setAmenityInput] = useState('')

  useEscapeKey(onClose)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(formData)
  }

  function addAmenity() {
    if (amenityInput.trim() && !formData.amenities?.includes(amenityInput.trim())) {
      setFormData({
        ...formData,
        amenities: [...(formData.amenities || []), amenityInput.trim()],
      })
      setAmenityInput('')
    }
  }

  function removeAmenity(amenity: string) {
    setFormData({
      ...formData,
      amenities: formData.amenities?.filter(a => a !== amenity) || [],
    })
  }

  const inputClass = "w-full px-4 py-2 border border-stone-300 rounded-lg bg-white text-stone-900 focus:ring-2 focus:ring-clover-500 focus:border-transparent"
  const labelClass = "block text-sm font-medium text-stone-700 mb-1"

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-modal-title"
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 my-8 border border-stone-200">
        <h3 id="property-modal-title" className="text-lg font-semibold text-stone-900 mb-6">
          {property ? 'Edit Property' : 'Add Property'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="prop-name" className={labelClass}>Property Name *</label>
              <input id="prop-name" type="text" required autoFocus value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="prop-address1" className={labelClass}>Address Line 1 *</label>
              <input id="prop-address1" type="text" required value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="prop-address2" className={labelClass}>Address Line 2</label>
              <input id="prop-address2" type="text" value={formData.addressLine2 || ''}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                className={inputClass} />
            </div>

            <div>
              <label htmlFor="prop-city" className={labelClass}>City *</label>
              <input id="prop-city" type="text" required value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prop-state" className={labelClass}>State *</label>
                <input id="prop-state" type="text" required maxLength={2} value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                  className={inputClass} />
              </div>
              <div>
                <label htmlFor="prop-zip" className={labelClass}>ZIP *</label>
                <input id="prop-zip" type="text" required value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="prop-type" className={labelClass}>Property Type *</label>
              <select id="prop-type" required value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className={inputClass}>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prop-bedrooms" className={labelClass}>Bedrooms *</label>
                <input id="prop-bedrooms" type="number" required min={0} value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                  className={inputClass} />
              </div>
              <div>
                <label htmlFor="prop-bathrooms" className={labelClass}>Bathrooms *</label>
                <input id="prop-bathrooms" type="number" required min={1} step={0.5} value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: parseFloat(e.target.value) || 1 })}
                  className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="prop-sqft" className={labelClass}>Square Feet</label>
              <input id="prop-sqft" type="number" min={0} value={formData.squareFeet || ''}
                onChange={(e) => setFormData({ ...formData, squareFeet: parseInt(e.target.value) || undefined })}
                className={inputClass} />
            </div>

            <div>
              <label htmlFor="prop-rent" className={labelClass}>Monthly Rent *</label>
              <input id="prop-rent" type="number" required min={0} value={formData.monthlyRent}
                onChange={(e) => setFormData({ ...formData, monthlyRent: parseInt(e.target.value) || 0 })}
                className={inputClass} />
            </div>

            <div>
              <label htmlFor="prop-deposit" className={labelClass}>Deposit Amount</label>
              <input id="prop-deposit" type="number" min={0} value={formData.depositAmount || ''}
                onChange={(e) => setFormData({ ...formData, depositAmount: parseInt(e.target.value) || undefined })}
                className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="prop-desc" className={labelClass}>Description</label>
              <textarea id="prop-desc" rows={3} value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`${inputClass} resize-none`} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="prop-amenity" className={labelClass}>Amenities</label>
              <div className="flex gap-2 mb-2">
                <input id="prop-amenity" type="text" value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  placeholder="Type an amenity and press Enter or Add"
                  className={inputClass} />
                <button type="button" onClick={addAmenity}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.amenities?.map((amenity) => (
                  <span key={amenity}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-clover-50 text-clover-700 rounded-full text-sm">
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      aria-label={`Remove ${amenity}`}
                      className="hover:text-clover-900"
                    >&times;</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 text-clover-600 border-stone-300 rounded focus:ring-clover-500" />
                <span className="text-sm font-medium text-stone-700">Available for rent</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <button type="button" onClick={onClose} disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-clover-600 hover:bg-clover-700 rounded-lg transition-colors disabled:opacity-50">
              {isLoading ? 'Saving...' : property ? 'Update Property' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
