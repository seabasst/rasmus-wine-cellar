'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Wine, CATEGORY_LABELS, WineCategory } from '@/types/wine'

interface QuickCountProps {
  wines: Wine[]
  onUpdateCount: (id: string, newCount: number) => void
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

export default function QuickCount({ wines, onUpdateCount }: QuickCountProps) {
  const [filter, setFilter] = useState<WineCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [showLowStockOnly, setShowLowStockOnly] = useState(false)

  const filteredWines = wines
    .filter(wine => wine.is_active)
    .filter(wine => filter === 'all' || wine.category === filter)
    .filter(wine => !showLowStockOnly || wine.bottle_count <= 2)
    .filter(wine =>
      wine.name.toLowerCase().includes(search.toLowerCase()) ||
      wine.producer.toLowerCase().includes(search.toLowerCase())
    )

  const lowStockCount = wines.filter(w => w.is_active && w.bottle_count <= 2).length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-wine/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-wine" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-serif text-charcoal">Quick Count</h2>
          <p className="text-sm text-warm-gray">Fast inventory updates for your cellar</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-cream-dark/50 rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or producer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as WineCategory | 'all')}
            className="input lg:w-48"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {/* Low Stock Toggle */}
          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              showLowStockOnly
                ? 'bg-wine text-white'
                : 'bg-white border border-cream-dark text-charcoal hover:border-warm-gray'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Low Stock ({lowStockCount})
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-warm-gray mb-4">
        {filteredWines.length} wine{filteredWines.length !== 1 ? 's' : ''} to count
      </p>

      {/* Wine List */}
      <div className="space-y-3">
        {filteredWines.map((wine, index) => (
          <div
            key={wine.id}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-cream-dark hover:border-wine/20 hover:shadow-md transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            {/* Wine Image Thumbnail */}
            <div className="relative w-14 h-20 rounded-lg overflow-hidden bg-cream-dark shrink-0">
              {wine.image_url ? (
                <Image
                  src={wine.image_url}
                  alt={wine.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-warm-gray/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Wine Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`badge ${categoryBadgeClass[wine.category]} text-[10px] px-2 py-0.5`}>
                  {CATEGORY_LABELS[wine.category]}
                </span>
                {wine.vintage && (
                  <span className="text-xs text-warm-gray">{wine.vintage}</span>
                )}
              </div>
              <h3 className="font-serif text-lg text-charcoal truncate">{wine.name}</h3>
              <p className="text-sm text-warm-gray truncate">{wine.producer}</p>
            </div>

            {/* Stock Counter - Large Touch-Friendly Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateCount(wine.id, Math.max(0, wine.bottle_count - 1))}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-cream-dark hover:bg-wine hover:text-white text-charcoal text-2xl font-light transition-all duration-200 active:scale-95"
                title="Remove one bottle"
              >
                −
              </button>
              <input
                type="number"
                min="0"
                value={wine.bottle_count}
                onChange={(e) => onUpdateCount(wine.id, parseInt(e.target.value) || 0)}
                className={`w-16 h-12 text-center border-2 rounded-xl text-xl font-serif font-semibold transition-colors focus:outline-none focus:border-wine ${
                  wine.bottle_count <= 2
                    ? 'border-wine/50 text-wine bg-wine/5'
                    : 'border-cream-dark text-charcoal bg-white'
                }`}
              />
              <button
                onClick={() => onUpdateCount(wine.id, wine.bottle_count + 1)}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-wine/10 hover:bg-wine hover:text-white text-wine text-2xl font-light transition-all duration-200 active:scale-95"
                title="Add one bottle"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredWines.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream-dark flex items-center justify-center">
            <svg className="w-8 h-8 text-warm-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-serif text-charcoal mb-2">No wines found</h3>
          <p className="text-warm-gray text-sm">
            {showLowStockOnly
              ? 'No wines are low on stock. Great job keeping inventory!'
              : 'Try adjusting your search or filters.'}
          </p>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="mt-8 p-4 bg-cream-dark/30 rounded-xl">
        <p className="text-xs text-warm-gray text-center">
          Tip: Click directly on the count to type a new value, or use the +/- buttons for quick adjustments
        </p>
      </div>
    </div>
  )
}
