'use client'

import { useState } from 'react'
import { Wine, WineCategory, CATEGORY_LABELS } from '@/types/wine'

interface WineFormProps {
  wine?: Wine
  onSubmit: (data: Partial<Wine>) => Promise<void>
  onCancel: () => void
}

export default function WineForm({ wine, onSubmit, onCancel }: WineFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: wine?.name ?? '',
    producer: wine?.producer ?? '',
    region: wine?.region ?? '',
    country: wine?.country ?? '',
    vintage: wine?.vintage?.toString() ?? '',
    category: wine?.category ?? 'red' as WineCategory,
    grape_variety: wine?.grape_variety ?? '',
    bottle_count: wine?.bottle_count?.toString() ?? '0',
    glass_price: wine?.glass_price?.toString() ?? '',
    bottle_price: wine?.bottle_price?.toString() ?? '',
    tasting_notes: wine?.tasting_notes ?? '',
    is_active: wine?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        name: formData.name,
        producer: formData.producer,
        region: formData.region || null,
        country: formData.country || null,
        vintage: formData.vintage ? parseInt(formData.vintage) : null,
        category: formData.category,
        grape_variety: formData.grape_variety || null,
        bottle_count: parseInt(formData.bottle_count) || 0,
        glass_price: formData.glass_price ? parseFloat(formData.glass_price) : null,
        bottle_price: formData.bottle_price ? parseFloat(formData.bottle_price) : null,
        tasting_notes: formData.tasting_notes || null,
        is_active: formData.is_active,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wine Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g., Barolo Riserva"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Producer/Winery *
          </label>
          <input
            type="text"
            required
            value={formData.producer}
            onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g., Giacomo Conterno"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Region
          </label>
          <input
            type="text"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g., Piedmont"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g., Italy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vintage
          </label>
          <input
            type="number"
            min="1900"
            max="2030"
            value={formData.vintage}
            onChange={(e) => setFormData({ ...formData, vintage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g., 2019"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as WineCategory })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grape Variety
          </label>
          <input
            type="text"
            value={formData.grape_variety}
            onChange={(e) => setFormData({ ...formData, grape_variety: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g., Nebbiolo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bottles in Stock
          </label>
          <input
            type="number"
            min="0"
            value={formData.bottle_count}
            onChange={(e) => setFormData({ ...formData, bottle_count: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Glass Price
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.glass_price}
            onChange={(e) => setFormData({ ...formData, glass_price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bottle Price
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.bottle_price}
            onChange={(e) => setFormData({ ...formData, bottle_price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tasting Notes
        </label>
        <textarea
          rows={3}
          value={formData.tasting_notes}
          onChange={(e) => setFormData({ ...formData, tasting_notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Describe the wine's characteristics..."
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
          Show on menu
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : wine ? 'Update Wine' : 'Add Wine'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
