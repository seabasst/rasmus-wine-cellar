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
  const activeWines = wines.filter(w => w.is_active).length

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-gradient-to-b from-wine-deep to-wine border-b border-wine-deep/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-serif font-light text-white tracking-wide">
                Wine Cellar
              </h1>
              <p className="text-wine-rose/80 text-sm mt-1 tracking-widest uppercase">
                Inventory Management
              </p>
            </div>
            <a
              href="/menu"
              target="_blank"
              className="group flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-300 animate-fade-in"
            >
              <span className="text-sm font-medium">View Public Menu</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-5 animate-fade-in stagger-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-wine/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-wine" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-serif font-semibold text-charcoal">{wines.length}</div>
                <div className="text-sm text-warm-gray">Total Wines</div>
              </div>
            </div>
          </div>

          <div className="card p-5 animate-fade-in stagger-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-serif font-semibold text-charcoal">{activeWines}</div>
                <div className="text-sm text-warm-gray">On Menu</div>
              </div>
            </div>
          </div>

          <div className="card p-5 animate-fade-in stagger-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-champagne/50 flex items-center justify-center">
                <svg className="w-6 h-6 text-espresso" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-serif font-semibold text-charcoal">{totalBottles}</div>
                <div className="text-sm text-warm-gray">Bottles in Stock</div>
              </div>
            </div>
          </div>

          <div className="card p-5 animate-fade-in stagger-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${lowStock > 0 ? 'bg-wine/10' : 'bg-green-50'}`}>
                <svg className={`w-6 h-6 ${lowStock > 0 ? 'text-wine' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <div className={`text-3xl font-serif font-semibold ${lowStock > 0 ? 'text-wine' : 'text-green-600'}`}>
                  {lowStock}
                </div>
                <div className="text-sm text-warm-gray">Low Stock</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-in">
          <button
            onClick={() => { setView('list'); setEditingWine(null) }}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
              view === 'list'
                ? 'bg-wine text-white shadow-md'
                : 'bg-white text-charcoal border border-cream-dark hover:border-warm-gray hover:bg-cream-dark'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Wine Collection
            </span>
          </button>
          <button
            onClick={() => { setView('quick-count'); setEditingWine(null) }}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
              view === 'quick-count'
                ? 'bg-wine text-white shadow-md'
                : 'bg-white text-charcoal border border-cream-dark hover:border-warm-gray hover:bg-cream-dark'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              Quick Count
            </span>
          </button>
          <button
            onClick={() => { setView('add'); setEditingWine(null) }}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
              view === 'add'
                ? 'bg-wine text-white shadow-md'
                : 'bg-white text-charcoal border border-cream-dark hover:border-warm-gray hover:bg-cream-dark'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Wine
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="card p-6 animate-scale-in">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-3 border-wine/20 border-t-wine rounded-full animate-spin mb-4" />
              <p className="text-warm-gray">Loading your collection...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-wine/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-wine" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-wine font-medium mb-2">{error}</p>
              <p className="text-sm text-warm-gray">
                Make sure you have set up your Supabase environment variables.
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

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-warm-gray text-sm">
        <p>Wine Cellar &mdash; Crafted for Sommeliers</p>
      </footer>
    </div>
  )
}
