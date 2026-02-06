'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Wine, WineCategory, CATEGORY_LABELS } from '@/types/wine'

interface WineListProps {
  wines: Wine[]
  onEdit: (wine: Wine) => void
  onUpdateCount: (id: string, newCount: number) => void
  onDelete: (id: string) => void
}

const categoryBadgeClass: Record<WineCategory, string> = {
  red: 'badge-red',
  white: 'badge-white',
  rose: 'badge-rose',
  sparkling: 'badge-sparkling',
  dessert: 'badge-dessert',
  fortified: 'badge-fortified',
  orange: 'badge-orange',
}

type ViewMode = 'cards' | 'table'

export default function WineList({ wines, onEdit, onUpdateCount, onDelete }: WineListProps) {
  const [filter, setFilter] = useState<WineCategory | 'all'>('all')
  const [showInactive, setShowInactive] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const filteredWines = wines.filter(wine => {
    if (filter !== 'all' && wine.category !== filter) return false
    if (!showInactive && !wine.is_active) return false
    return true
  })

  const categories: (WineCategory | 'all')[] = ['all', 'red', 'white', 'rose', 'sparkling', 'dessert', 'fortified', 'orange']

  const handleInputFocus = (wine: Wine) => {
    setEditingId(wine.id)
    setEditValue(wine.bottle_count.toString())
  }

  const handleInputBlur = (wineId: string) => {
    const newCount = editValue === '' ? 0 : parseInt(editValue)
    if (!isNaN(newCount) && newCount >= 0) {
      onUpdateCount(wineId, newCount)
    }
    setEditingId(null)
    setEditValue('')
  }

  const handleInputChange = (value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setEditValue(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, wineId: string) => {
    if (e.key === 'Enter') {
      handleInputBlur(wineId)
    }
  }

  if (wines.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cream-dark flex items-center justify-center">
          <svg className="w-10 h-10 text-warm-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-serif text-charcoal mb-2">Your cellar is empty</h3>
        <p className="text-warm-gray">Click "Add Wine" to start building your collection.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-cream-dark">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                filter === cat
                  ? 'bg-wine text-white'
                  : 'bg-cream-dark text-charcoal hover:bg-warm-gray/20'
              }`}
            >
              {cat === 'all' ? 'All Wines' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* View Toggle */}
          <div className="flex bg-cream-dark rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === 'cards' ? 'bg-white text-charcoal shadow-sm' : 'text-warm-gray hover:text-charcoal'
              }`}
              title="Card view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === 'table' ? 'bg-white text-charcoal shadow-sm' : 'text-warm-gray hover:text-charcoal'
              }`}
              title="Table view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-warm-gray cursor-pointer">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 rounded border-cream-dark text-wine focus:ring-wine/20"
            />
            Show hidden
          </label>
        </div>
      </div>

      {/* Wine count */}
      <p className="text-sm text-warm-gray mb-4">
        Showing {filteredWines.length} of {wines.length} wines
      </p>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-cream-dark">
          <table className="w-full">
            <thead>
              <tr className="bg-cream-dark/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wide">Wine</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wide">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wide">Vintage</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-charcoal uppercase tracking-wide">Stock</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-charcoal uppercase tracking-wide">Glass</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-charcoal uppercase tracking-wide">Bottle</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-charcoal uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-charcoal uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {filteredWines.map((wine) => (
                <tr key={wine.id} className={`bg-white hover:bg-cream-dark/30 transition-colors ${!wine.is_active ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {wine.image_url && (
                        <div className="relative w-8 h-12 rounded overflow-hidden shrink-0">
                          <Image src={wine.image_url} alt={wine.name} fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-charcoal">{wine.name}</div>
                        <div className="text-sm text-warm-gray">{wine.producer}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${categoryBadgeClass[wine.category]} text-[10px]`}>
                      {CATEGORY_LABELS[wine.category]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal">{wine.vintage || 'NV'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onUpdateCount(wine.id, Math.max(0, wine.bottle_count - 1))}
                        className="w-7 h-7 flex items-center justify-center rounded bg-cream-dark hover:bg-wine hover:text-white text-charcoal transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={editingId === wine.id ? editValue : wine.bottle_count}
                        onFocus={() => handleInputFocus(wine)}
                        onBlur={() => handleInputBlur(wine.id)}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, wine.id)}
                        className={`w-12 h-7 text-center border rounded text-sm font-semibold focus:outline-none focus:border-wine ${
                          wine.bottle_count <= 2 ? 'border-wine/50 text-wine bg-wine/5' : 'border-cream-dark text-charcoal'
                        }`}
                      />
                      <button
                        onClick={() => onUpdateCount(wine.id, wine.bottle_count + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded bg-wine/10 hover:bg-wine hover:text-white text-wine transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal text-right">
                    {wine.glass_price ? `$${wine.glass_price}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal text-right font-medium">
                    {wine.bottle_price ? `$${wine.bottle_price}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      wine.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {wine.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(wine)}
                        className="text-sm text-wine hover:text-wine-deep font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${wine.name}"?`)) {
                            onDelete(wine.id)
                          }
                        }}
                        className="text-sm text-warm-gray hover:text-red-600 font-medium"
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

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredWines.map((wine, index) => (
            <div
              key={wine.id}
              className={`group relative bg-white rounded-xl overflow-hidden border border-cream-dark hover:border-wine/30 hover:shadow-lg transition-all duration-300 animate-fade-in ${
                !wine.is_active ? 'opacity-60' : ''
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Image */}
              <div className="relative aspect-[3/4] bg-gradient-to-b from-cream to-cream-dark overflow-hidden">
                {wine.image_url ? (
                  <Image
                    src={wine.image_url}
                    alt={wine.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-warm-gray">
                    <svg className="w-16 h-16 opacity-30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs opacity-50">No image</span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`badge ${categoryBadgeClass[wine.category]}`}>
                    {CATEGORY_LABELS[wine.category]}
                  </span>
                </div>

                {/* Status Badge */}
                {!wine.is_active && (
                  <div className="absolute top-3 right-3">
                    <span className="badge bg-charcoal/80 text-white">Hidden</span>
                  </div>
                )}

                {/* Low Stock Warning */}
                {wine.bottle_count <= 2 && wine.bottle_count > 0 && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-wine/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Low stock - {wine.bottle_count} left
                    </div>
                  </div>
                )}

                {/* Out of Stock */}
                {wine.bottle_count === 0 && (
                  <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
                    <span className="text-white font-medium text-lg tracking-wide">Out of Stock</span>
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(wine)}
                      className="px-4 py-2 bg-white text-charcoal text-sm font-medium rounded-lg hover:bg-cream transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${wine.name}"?`)) {
                          onDelete(wine.id)
                        }
                      }}
                      className="px-4 py-2 bg-wine/90 text-white text-sm font-medium rounded-lg hover:bg-wine transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg text-charcoal truncate" title={wine.name}>
                      {wine.name}
                    </h3>
                    <p className="text-sm text-warm-gray truncate" title={wine.producer}>
                      {wine.producer}
                    </p>
                  </div>
                  {wine.vintage && (
                    <span className="text-sm font-medium text-wine bg-wine/10 px-2 py-0.5 rounded shrink-0">
                      {wine.vintage}
                    </span>
                  )}
                </div>

                {/* Region */}
                {(wine.region || wine.country) && (
                  <p className="text-xs text-warm-gray mb-3 truncate">
                    {wine.region}{wine.region && wine.country ? ', ' : ''}{wine.country}
                  </p>
                )}

                {/* Pricing */}
                <div className="flex items-center gap-3 mb-4 text-sm">
                  {wine.glass_price && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-warm-gray">Glass</span>
                      <span className="text-charcoal font-medium">${wine.glass_price}</span>
                    </div>
                  )}
                  {wine.bottle_price && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-warm-gray">Bottle</span>
                      <span className="text-charcoal font-medium">${wine.bottle_price}</span>
                    </div>
                  )}
                </div>

                {/* Stock Counter */}
                <div className="flex items-center justify-between pt-3 border-t border-cream-dark">
                  <span className="text-xs text-warm-gray uppercase tracking-wide">Stock</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateCount(wine.id, Math.max(0, wine.bottle_count - 1))}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-cream-dark hover:bg-wine hover:text-white text-charcoal transition-colors text-lg font-light"
                    >
                      −
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editingId === wine.id ? editValue : wine.bottle_count}
                      onFocus={() => handleInputFocus(wine)}
                      onBlur={() => handleInputBlur(wine.id)}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, wine.id)}
                      className={`w-10 h-7 text-center border rounded text-sm font-semibold focus:outline-none focus:border-wine ${
                        wine.bottle_count <= 2 ? 'border-wine/50 text-wine bg-wine/5' : 'border-cream-dark text-charcoal'
                      }`}
                    />
                    <button
                      onClick={() => onUpdateCount(wine.id, wine.bottle_count + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-cream-dark hover:bg-wine hover:text-white text-charcoal transition-colors text-lg font-light"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
