'use client'

import { Wine, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/wine'

interface WineListProps {
  wines: Wine[]
  onEdit: (wine: Wine) => void
  onUpdateCount: (id: string, newCount: number) => void
  onDelete: (id: string) => void
}

export default function WineList({ wines, onEdit, onUpdateCount, onDelete }: WineListProps) {
  if (wines.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No wines in your cellar yet.</p>
        <p className="text-sm mt-2">Click "Add Wine" to get started.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Wine
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vintage
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Glass
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bottle
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {wines.map((wine) => (
            <tr key={wine.id} className={!wine.is_active ? 'bg-gray-50 opacity-60' : ''}>
              <td className="px-4 py-4">
                <div className="font-medium text-gray-900">{wine.name}</div>
                <div className="text-sm text-gray-500">{wine.producer}</div>
                {wine.region && (
                  <div className="text-xs text-gray-400">
                    {wine.region}{wine.country ? `, ${wine.country}` : ''}
                  </div>
                )}
              </td>
              <td className="px-4 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${CATEGORY_COLORS[wine.category]}`}>
                  {CATEGORY_LABELS[wine.category]}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-gray-900">
                {wine.vintage || 'NV'}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onUpdateCount(wine.id, Math.max(0, wine.bottle_count - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    title="Remove one bottle"
                  >
                    -
                  </button>
                  <span className={`font-medium min-w-[2rem] text-center ${wine.bottle_count <= 2 ? 'text-red-600' : 'text-gray-900'}`}>
                    {wine.bottle_count}
                  </span>
                  <button
                    onClick={() => onUpdateCount(wine.id, wine.bottle_count + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    title="Add one bottle"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-gray-900 text-right">
                {wine.glass_price ? `$${wine.glass_price.toFixed(2)}` : '-'}
              </td>
              <td className="px-4 py-4 text-sm text-gray-900 text-right">
                {wine.bottle_price ? `$${wine.bottle_price.toFixed(2)}` : '-'}
              </td>
              <td className="px-4 py-4 text-center">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  wine.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {wine.is_active ? 'On Menu' : 'Hidden'}
                </span>
              </td>
              <td className="px-4 py-4 text-right space-x-2">
                <button
                  onClick={() => onEdit(wine)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this wine?')) {
                      onDelete(wine.id)
                    }
                  }}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
