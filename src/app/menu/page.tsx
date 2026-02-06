import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Wine, WineCategory, CATEGORY_LABELS } from '@/types/wine'
import DownloadMenuButton from '@/components/DownloadMenuButton'

export const dynamic = 'force-dynamic' // Always fetch fresh data

const categoryDescriptions: Record<WineCategory, string> = {
  sparkling: 'Effervescent wines for celebration and aperitifs',
  white: 'Crisp and elegant wines for lighter fare',
  rose: 'Fresh and vibrant wines for warm days',
  orange: 'Skin-contact wines with complexity and depth',
  red: 'Bold and structured wines for hearty dishes',
  dessert: 'Sweet wines to finish the evening',
  fortified: 'Rich, powerful wines with distinctive character',
}

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
    <div className="min-h-screen bg-cream">
      {/* Download Button - fixed position, hidden in PDF */}
      <div className="fixed top-6 right-6 z-50 print:hidden">
        <DownloadMenuButton />
      </div>

      <div id="wine-menu" className="bg-cream">
        {/* Header */}
        <header className="bg-gradient-to-b from-wine-deep to-wine py-16 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-champagne rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div className="inline-block mb-4">
              <svg className="w-12 h-12 text-champagne mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h1 className="text-5xl font-serif font-light text-white tracking-wide mb-3">
              Wine Selection
            </h1>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-champagne to-transparent mx-auto mb-3" />
            <p className="text-wine-rose/80 text-sm tracking-[0.3em] uppercase">
              Curated by our Sommelier
            </p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          {categoryOrder.map((category) => {
            const categoryWines = winesByCategory[category]
            if (!categoryWines || categoryWines.length === 0) return null

            return (
              <section key={category} className="mb-16">
                {/* Category Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-serif text-charcoal mb-2">
                    {CATEGORY_LABELS[category]}
                  </h2>
                  <p className="text-sm text-warm-gray italic">
                    {categoryDescriptions[category]}
                  </p>
                  <div className="w-16 h-[1px] bg-wine/30 mx-auto mt-4" />
                </div>

                <div className="space-y-6">
                  {categoryWines.map((wine: Wine) => (
                    <div
                      key={wine.id}
                      className="group flex gap-4 p-4 rounded-xl bg-white/60 hover:bg-white border border-cream-dark/50 hover:border-wine/20 transition-all duration-300 hover:shadow-md"
                    >
                      {/* Wine Image */}
                      {wine.image_url && (
                        <div className="relative w-16 h-24 rounded-lg overflow-hidden shrink-0 shadow-sm">
                          <Image
                            src={wine.image_url}
                            alt={wine.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}

                      {/* Wine Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-serif text-xl text-charcoal group-hover:text-wine transition-colors">
                              {wine.name}
                              {wine.vintage && (
                                <span className="ml-2 text-warm-gray font-normal text-base">
                                  {wine.vintage}
                                </span>
                              )}
                            </h3>
                            <p className="text-warm-gray text-sm mt-0.5">
                              {wine.producer}
                              {wine.region && ` · ${wine.region}`}
                              {wine.country && `, ${wine.country}`}
                            </p>
                            {wine.grape_variety && (
                              <p className="text-wine/70 text-sm italic mt-1">
                                {wine.grape_variety}
                              </p>
                            )}
                          </div>

                          {/* Pricing */}
                          <div className="text-right shrink-0">
                            {wine.glass_price && (
                              <div className="text-warm-gray text-sm">
                                <span className="text-xs uppercase tracking-wide opacity-70">Glass</span>{' '}
                                <span className="font-serif font-medium text-charcoal">${wine.glass_price}</span>
                              </div>
                            )}
                            {wine.bottle_price && (
                              <div className="text-charcoal">
                                <span className="text-xs uppercase tracking-wide text-warm-gray opacity-70">Bottle</span>{' '}
                                <span className="font-serif font-semibold text-lg">${wine.bottle_price}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tasting Notes */}
                        {wine.tasting_notes && (
                          <p className="text-warm-gray text-sm mt-2 leading-relaxed border-t border-cream-dark/50 pt-2">
                            {wine.tasting_notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}

          {Object.keys(winesByCategory).length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cream-dark flex items-center justify-center">
                <svg className="w-10 h-10 text-warm-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif text-charcoal mb-2">Selection Coming Soon</h2>
              <p className="text-warm-gray">Our wine collection is being curated.</p>
              <p className="text-sm text-warm-gray mt-1">Please check back soon.</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-b from-cream-dark/50 to-cream-dark py-10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="w-12 h-[1px] bg-warm-gray/30 mx-auto mb-6" />
            <p className="text-warm-gray text-sm">
              Wines subject to availability
            </p>
            <p className="text-warm-gray/70 text-sm mt-1">
              Please ask your server about our reserve selections
            </p>
            <div className="mt-6 pt-6 border-t border-warm-gray/20">
              <p className="text-xs text-warm-gray/50 tracking-widest uppercase">
                Wine Cellar
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
