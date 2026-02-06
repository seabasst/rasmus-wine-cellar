'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Wine, WineCategory, CATEGORY_LABELS } from '@/types/wine'

interface WineFormProps {
  wine?: Wine
  onSubmit: (data: Partial<Wine>) => Promise<void>
  onCancel: () => void
}

export default function WineForm({ wine, onSubmit, onCancel }: WineFormProps) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setFormData(prev => ({ ...prev, image_url: base64 }))
    }
    reader.readAsDataURL(file)
  }
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
    image_url: wine?.image_url ?? '',
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
        image_url: formData.image_url || null,
        is_active: formData.is_active,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-wine/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-wine" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-serif text-charcoal">
            {wine ? 'Edit Wine' : 'Add New Wine'}
          </h2>
          <p className="text-sm text-warm-gray">
            {wine ? 'Update the details below' : 'Fill in the details to add a wine to your collection'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Image */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <label className="label">Wine Label Image</label>
            {/* Hidden file input for camera capture */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              className="hidden"
            />
            {/* Clickable image area */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-cream-dark border-2 border-dashed border-warm-gray/30 hover:border-wine/50 active:border-wine transition-colors cursor-pointer"
            >
              {formData.image_url ? (
                <>
                  <Image
                    src={formData.image_url}
                    alt="Wine label preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 hover:opacity-100 text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-lg">
                      Tap to change
                    </span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-warm-gray p-6">
                  <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-center font-medium">Tap to take photo</span>
                  <span className="text-xs text-center mt-1 opacity-70">or paste URL below</span>
                </div>
              )}
            </button>
            {/* URL input as alternative */}
            <input
              type="url"
              value={formData.image_url.startsWith('data:') ? '' : formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="input mt-3"
              placeholder="Or paste image URL..."
            />
            {formData.image_url && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image_url: '' })}
                className="text-xs text-wine hover:text-wine-deep mt-2"
              >
                Remove image
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-cream-dark/50 rounded-xl p-5">
            <h3 className="text-lg font-serif text-charcoal mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-wine text-white text-xs flex items-center justify-center">1</span>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Wine Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="e.g., Barolo Riserva"
                />
              </div>
              <div>
                <label className="label">Producer / Winery *</label>
                <input
                  type="text"
                  required
                  value={formData.producer}
                  onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
                  className="input"
                  placeholder="e.g., Giacomo Conterno"
                />
              </div>
              <div>
                <label className="label">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as WineCategory })}
                  className="input"
                >
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Vintage</label>
                <input
                  type="number"
                  min="1900"
                  max="2030"
                  value={formData.vintage}
                  onChange={(e) => setFormData({ ...formData, vintage: e.target.value })}
                  className="input"
                  placeholder="e.g., 2019 (leave blank for NV)"
                />
              </div>
            </div>
          </div>

          {/* Origin */}
          <div className="bg-cream-dark/50 rounded-xl p-5">
            <h3 className="text-lg font-serif text-charcoal mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-wine text-white text-xs flex items-center justify-center">2</span>
              Origin & Grape
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Region</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="input"
                  placeholder="e.g., Piedmont"
                />
              </div>
              <div>
                <label className="label">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="input"
                  placeholder="e.g., Italy"
                />
              </div>
              <div>
                <label className="label">Grape Variety</label>
                <input
                  type="text"
                  value={formData.grape_variety}
                  onChange={(e) => setFormData({ ...formData, grape_variety: e.target.value })}
                  className="input"
                  placeholder="e.g., Nebbiolo"
                />
              </div>
            </div>
          </div>

          {/* Inventory & Pricing */}
          <div className="bg-cream-dark/50 rounded-xl p-5">
            <h3 className="text-lg font-serif text-charcoal mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-wine text-white text-xs flex items-center justify-center">3</span>
              Inventory & Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Bottles in Stock</label>
                <input
                  type="number"
                  min="0"
                  value={formData.bottle_count}
                  onChange={(e) => setFormData({ ...formData, bottle_count: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Glass Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.glass_price}
                  onChange={(e) => setFormData({ ...formData, glass_price: e.target.value })}
                  className="input"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="label">Bottle Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.bottle_price}
                  onChange={(e) => setFormData({ ...formData, bottle_price: e.target.value })}
                  className="input"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Tasting Notes */}
          <div className="bg-cream-dark/50 rounded-xl p-5">
            <h3 className="text-lg font-serif text-charcoal mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-wine text-white text-xs flex items-center justify-center">4</span>
              Tasting Notes
            </h3>
            <textarea
              rows={3}
              value={formData.tasting_notes}
              onChange={(e) => setFormData({ ...formData, tasting_notes: e.target.value })}
              className="input resize-none"
              placeholder="Describe the wine's characteristics, aromas, and flavors..."
            />
          </div>

          {/* Menu Status */}
          <div className="flex items-center justify-between p-5 bg-cream-dark/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                <svg className={`w-5 h-5 ${formData.is_active ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-charcoal">Show on Menu</div>
                <div className="text-sm text-warm-gray">
                  {formData.is_active ? 'This wine is visible on the public menu' : 'This wine is hidden from the public menu'}
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-wine/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-wine"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn btn-primary py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                <span>{wine ? 'Update Wine' : 'Add to Collection'}</span>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary py-3 px-8"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
