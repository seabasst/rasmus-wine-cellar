'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Wine } from '@/types/wine'
import WineList from '@/components/WineList'
import WineForm from '@/components/WineForm'
import QuickCount from '@/components/QuickCount'

type View = 'list' | 'quick-count' | 'add' | 'edit'

export default function Home() {
  const [wines, setWines] = useState<Wine[]>([])
  const [view, setView] = useState<View>('list')
  const [editingWine, setEditingWine] = useState<Wine | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = useMemo(() => createClient(), [])

  const fetchWines = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      setError('Failed to load wines. Check your Supabase connection.')
      console.error(error)
    } else {
      setWines(data || [])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchWines()
  }, [fetchWines])

  const handleAddWine = async (data: Partial<Wine>) => {
    const { error } = await supabase.from('wines').insert([data])
    if (error) {
      alert('Failed to add wine: ' + error.message)
      return
    }
    await fetchWines()
    setView('list')
  }

  const handleEditWine = async (data: Partial<Wine>) => {
    if (!editingWine) return
    const { error } = await supabase
      .from('wines')
      .update(data)
      .eq('id', editingWine.id)
    if (error) {
      alert('Failed to update wine: ' + error.message)
      return
    }
    await fetchWines()
    setEditingWine(null)
    setView('list')
  }

  const handleUpdateCount = async (id: string, newCount: number) => {
    // Optimistically update UI
    setWines(prev =>
      prev.map(w => (w.id === id ? { ...w, bottle_count: newCount } : w))
    )

    const { error } = await supabase
      .from('wines')
      .update({ bottle_count: newCount })
      .eq('id', id)

    if (error) {
      // Revert on error
      await fetchWines()
      alert('Failed to update count: ' + error.message)
    }
  }

  const handleDeleteWine = async (id: string) => {
    const { error } = await supabase.from('wines').delete().eq('id', id)
    if (error) {
      alert('Failed to delete wine: ' + error.message)
      return
    }
    await fetchWines()
  }

  const startEdit = (wine: Wine) => {
    setEditingWine(wine)
    setView('edit')
  }

  const totalBottles = wines.reduce((sum, w) => sum + w.bottle_count, 0)
  const lowStock = wines.filter(w => w.bottle_count <= 2 && w.is_active).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Wine Cellar</h1>
              <p className="text-sm text-gray-500">Inventory Management</p>
            </div>
            <a
              href="/menu"
              target="_blank"
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              View Public Menu →
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{wines.length}</div>
            <div className="text-sm text-gray-500">Total Wines</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{totalBottles}</div>
            <div className="text-sm text-gray-500">Bottles in Stock</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className={`text-2xl font-bold ${lowStock > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {lowStock}
            </div>
            <div className="text-sm text-gray-500">Low Stock Alerts</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setView('list'); setEditingWine(null) }}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              view === 'list'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Wine List
          </button>
          <button
            onClick={() => { setView('quick-count'); setEditingWine(null) }}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              view === 'quick-count'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Quick Count
          </button>
          <button
            onClick={() => { setView('add'); setEditingWine(null) }}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              view === 'add'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            + Add Wine
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading wines...</div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500">
                Make sure you have set up your Supabase environment variables and run the schema.
              </p>
            </div>
          ) : (
            <>
              {view === 'list' && (
                <WineList
                  wines={wines}
                  onEdit={startEdit}
                  onUpdateCount={handleUpdateCount}
                  onDelete={handleDeleteWine}
                />
              )}
              {view === 'quick-count' && (
                <QuickCount wines={wines} onUpdateCount={handleUpdateCount} />
              )}
              {view === 'add' && (
                <WineForm
                  onSubmit={handleAddWine}
                  onCancel={() => setView('list')}
                />
              )}
              {view === 'edit' && editingWine && (
                <WineForm
                  wine={editingWine}
                  onSubmit={handleEditWine}
                  onCancel={() => { setEditingWine(null); setView('list') }}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
