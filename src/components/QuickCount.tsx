'use client'

import { useState } from 'react'
import { Wine, CATEGORY_LABELS, WineCategory } from '@/types/wine'

interface QuickCountProps {
  wines: Wine[]
  onUpdateCount: (id: string, newCount: number) => void
}

export default function QuickCount({ wines, onUpdateCount }: QuickCountProps) {
  const [filter, setFilter] = useState<WineCategory | 'all'>('all')
  const [search, setSearch] = useState('')

  const filteredWines = wines
    .filter(wine => filter === 'all' || wine.category === filter)
    .filter(wine =>
      wine.name.toLowerCase().includes(search.toLowerCase()) ||
      wine.producer.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search wines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as WineCategory | 'all')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="all">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-3">
        {filteredWines.map((wine) => (
          <div
            key={wine.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">{wine.name}</div>
              <div className="text-sm text-gray-500 truncate">
                {wine.producer} {wine.vintage ? `• ${wine.vintage}` : ''}
              </div>
            </div>

            <div className="flex items-center gap-3 ml-4">
              <button
                onClick={() => onUpdateCount(wine.id, Math.max(0, wine.bottle_count - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-700 text-xl font-bold transition-colors"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={wine.bottle_count}
                onChange={(e) => onUpdateCount(wine.id, parseInt(e.target.value) || 0)}
                className="w-16 h-10 text-center border border-gray-300 rounded-md text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={() => onUpdateCount(wine.id, wine.bottle_count + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 text-green-700 text-xl font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredWines.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No wines match your search.
        </div>
      )}
    </div>
  )
}
