import { createClient } from '@/lib/supabase/server'
import { Wine, WineCategory, CATEGORY_LABELS } from '@/types/wine'

export const dynamic = 'force-dynamic' // Always fetch fresh data

export default async function MenuPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('wines')
    .select('*')
    .eq('is_active', true)
    .gt('bottle_count', 0)
    .order('category', { ascending: true })
    .order('name', { ascending: true })
  const wines = (data || []) as Wine[]

  // Group wines by category
  const winesByCategory = wines.reduce((acc, wine) => {
    const category = wine.category as WineCategory
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(wine)
    return acc
  }, {} as Record<WineCategory, Wine[]>)

  const categoryOrder: WineCategory[] = [
    'sparkling',
    'white',
    'rose',
    'orange',
    'red',
    'dessert',
    'fortified',
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-stone-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-serif font-light tracking-wide mb-2">
            Wine Selection
          </h1>
          <p className="text-stone-400 text-sm tracking-widest uppercase">
            Curated by our Sommelier
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {categoryOrder.map((category) => {
          const categoryWines = winesByCategory[category]
          if (!categoryWines || categoryWines.length === 0) return null

          return (
            <section key={category} className="mb-12">
              <h2 className="text-2xl font-serif text-stone-800 mb-6 pb-2 border-b border-stone-300">
                {CATEGORY_LABELS[category]}
              </h2>

              <div className="space-y-6">
                {categoryWines.map((wine: Wine) => (
                  <div key={wine.id} className="group">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-stone-900">
                          {wine.name}
                          {wine.vintage && (
                            <span className="ml-2 text-stone-500 font-normal">
                              {wine.vintage}
                            </span>
                          )}
                        </h3>
                        <p className="text-stone-600 text-sm">
                          {wine.producer}
                          {wine.region && ` · ${wine.region}`}
                          {wine.country && `, ${wine.country}`}
                        </p>
                        {wine.grape_variety && (
                          <p className="text-stone-500 text-sm italic">
                            {wine.grape_variety}
                          </p>
                        )}
                        {wine.tasting_notes && (
                          <p className="text-stone-500 text-sm mt-1">
                            {wine.tasting_notes}
                          </p>
                        )}
                      </div>

                      <div className="text-right whitespace-nowrap">
                        {wine.glass_price && (
                          <div className="text-stone-600">
                            <span className="text-xs uppercase tracking-wide">Glass</span>{' '}
                            <span className="font-medium">${wine.glass_price.toFixed(0)}</span>
                          </div>
                        )}
                        {wine.bottle_price && (
                          <div className="text-stone-900">
                            <span className="text-xs uppercase tracking-wide">Bottle</span>{' '}
                            <span className="font-medium">${wine.bottle_price.toFixed(0)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        {Object.keys(winesByCategory).length === 0 && (
          <div className="text-center py-12 text-stone-500">
            <p>Our wine selection is being updated.</p>
            <p className="text-sm mt-2">Please check back soon.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-100 py-8 text-center text-stone-500 text-sm">
        <p>Wines subject to availability</p>
        <p className="mt-1">Please ask your server about our reserve selections</p>
      </footer>
    </div>
  )
}
