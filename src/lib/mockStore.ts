import { Wine } from '@/types/wine'

// Error type matching Supabase's PostgrestError
type MockError = { message: string; details: string; hint: string; code: string } | null

// Sample wines for local testing
const sampleWines: Wine[] = [
  {
    id: '1',
    name: 'Barolo Riserva',
    producer: 'Giacomo Conterno',
    region: 'Piedmont',
    country: 'Italy',
    vintage: 2018,
    category: 'red',
    grape_variety: 'Nebbiolo',
    bottle_count: 6,
    glass_price: 28,
    bottle_price: 185,
    tasting_notes: 'Complex aromas of tar, roses, and dried cherries. Full-bodied with firm tannins.',
    image_url: 'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=400&h=600&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Chablis Grand Cru Les Clos',
    producer: 'Domaine William Fèvre',
    region: 'Burgundy',
    country: 'France',
    vintage: 2021,
    category: 'white',
    grape_variety: 'Chardonnay',
    bottle_count: 4,
    glass_price: 22,
    bottle_price: 120,
    tasting_notes: 'Minerally and precise with notes of citrus, flint, and white flowers.',
    image_url: 'https://images.unsplash.com/photo-1566754436137-6c738d8f3256?w=400&h=600&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Champagne Brut Réserve',
    producer: 'Billecart-Salmon',
    region: 'Champagne',
    country: 'France',
    vintage: null,
    category: 'sparkling',
    grape_variety: 'Chardonnay, Pinot Noir, Pinot Meunier',
    bottle_count: 12,
    glass_price: 18,
    bottle_price: 85,
    tasting_notes: 'Elegant and refined with fine bubbles, notes of brioche and citrus.',
    image_url: 'https://images.unsplash.com/photo-1594372365401-3b5ff14eaaed?w=400&h=600&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Whispering Angel',
    producer: 'Château d\'Esclans',
    region: 'Provence',
    country: 'France',
    vintage: 2023,
    category: 'rose',
    grape_variety: 'Grenache, Rolle',
    bottle_count: 8,
    glass_price: 14,
    bottle_price: 55,
    tasting_notes: 'Pale pink with delicate aromas of strawberry and white peach.',
    image_url: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=400&h=600&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Sauternes',
    producer: 'Château d\'Yquem',
    region: 'Bordeaux',
    country: 'France',
    vintage: 2015,
    category: 'dessert',
    grape_variety: 'Sémillon, Sauvignon Blanc',
    bottle_count: 2,
    glass_price: 35,
    bottle_price: 450,
    tasting_notes: 'Luscious honey, apricot, and tropical fruit with perfect acidity.',
    image_url: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=400&h=600&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Amarone della Valpolicella',
    producer: 'Bertani',
    region: 'Veneto',
    country: 'Italy',
    vintage: 2017,
    category: 'red',
    grape_variety: 'Corvina, Rondinella, Molinara',
    bottle_count: 5,
    glass_price: 24,
    bottle_price: 140,
    tasting_notes: 'Rich and velvety with dried fruit, chocolate, and spice.',
    image_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=600&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Riesling Spätlese',
    producer: 'Dr. Loosen',
    region: 'Mosel',
    country: 'Germany',
    vintage: 2022,
    category: 'white',
    grape_variety: 'Riesling',
    bottle_count: 10,
    glass_price: 12,
    bottle_price: 45,
    tasting_notes: 'Off-dry with vibrant acidity, green apple, and slate minerality.',
    image_url: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=400&h=600&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Vintage Port',
    producer: 'Taylor\'s',
    region: 'Douro',
    country: 'Portugal',
    vintage: 2011,
    category: 'fortified',
    grape_variety: 'Touriga Nacional, Touriga Franca',
    bottle_count: 3,
    glass_price: 20,
    bottle_price: 95,
    tasting_notes: 'Dense and powerful with blackberry, chocolate, and violet notes.',
    image_url: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&h=600&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Ribolla Gialla',
    producer: 'Gravner',
    region: 'Friuli-Venezia Giulia',
    country: 'Italy',
    vintage: 2015,
    category: 'orange',
    grape_variety: 'Ribolla Gialla',
    bottle_count: 4,
    glass_price: 18,
    bottle_price: 90,
    tasting_notes: 'Amber-hued with dried apricot, honey, and tannic grip from skin contact.',
    image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=600&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Rioja Gran Reserva',
    producer: 'López de Heredia',
    region: 'Rioja',
    country: 'Spain',
    vintage: 2010,
    category: 'red',
    grape_variety: 'Tempranillo, Garnacha, Graciano',
    bottle_count: 1,
    glass_price: 26,
    bottle_price: 110,
    tasting_notes: 'Traditional style with dried cherry, leather, and balsamic notes.',
    image_url: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=600&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// In-memory store
let wines: Wine[] = [...sampleWines]
let nextId = 11

// Helper to simulate async behavior
const delay = (ms: number = 50) => new Promise(resolve => setTimeout(resolve, ms))

// Mock query builder that mimics Supabase's API
class MockQueryBuilder {
  private _data: Wine[] = []
  private _filters: Array<(w: Wine) => boolean> = []
  private _orderBy: Array<{ column: keyof Wine; ascending: boolean }> = []
  private _selectAll = false

  constructor(data: Wine[]) {
    this._data = data
  }

  select(_columns: string = '*') {
    this._selectAll = true
    return this
  }

  eq<K extends keyof Wine>(column: K, value: Wine[K]) {
    this._filters.push((w) => w[column] === value)
    return this
  }

  gt<K extends keyof Wine>(column: K, value: number) {
    this._filters.push((w) => (w[column] as number) > value)
    return this
  }

  order(column: keyof Wine, options: { ascending: boolean } = { ascending: true }) {
    this._orderBy.push({ column, ascending: options.ascending })
    return this
  }

  async then<T>(
    resolve: (result: { data: Wine[] | null; error: MockError }) => T
  ): Promise<T> {
    await delay()
    let result = [...this._data]

    // Apply filters
    for (const filter of this._filters) {
      result = result.filter(filter)
    }

    // Apply ordering
    for (const { column, ascending } of this._orderBy) {
      result.sort((a, b) => {
        const aVal = a[column]
        const bVal = b[column]
        if (aVal === null) return ascending ? 1 : -1
        if (bVal === null) return ascending ? -1 : 1
        if (aVal < bVal) return ascending ? -1 : 1
        if (aVal > bVal) return ascending ? 1 : -1
        return 0
      })
    }

    return resolve({ data: result, error: null })
  }
}

class MockInsertBuilder {
  private _data: Partial<Wine>[]

  constructor(data: Partial<Wine>[]) {
    this._data = data
  }

  async then<T>(
    resolve: (result: { data: Wine[] | null; error: MockError }) => T
  ): Promise<T> {
    await delay()
    const newWines: Wine[] = this._data.map((w) => ({
      id: String(nextId++),
      name: w.name || '',
      producer: w.producer || '',
      region: w.region || null,
      country: w.country || null,
      vintage: w.vintage || null,
      category: w.category || 'red',
      grape_variety: w.grape_variety || null,
      bottle_count: w.bottle_count || 0,
      glass_price: w.glass_price || null,
      bottle_price: w.bottle_price || null,
      tasting_notes: w.tasting_notes || null,
      image_url: w.image_url || null,
      is_active: w.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
    wines.push(...newWines)
    return resolve({ data: newWines, error: null })
  }
}

class MockUpdateBuilder {
  private _updates: Partial<Wine>
  private _filters: Array<(w: Wine) => boolean> = []

  constructor(updates: Partial<Wine>) {
    this._updates = updates
  }

  eq<K extends keyof Wine>(column: K, value: Wine[K]) {
    this._filters.push((w) => w[column] === value)
    return this
  }

  async then<T>(
    resolve: (result: { data: Wine[] | null; error: MockError }) => T
  ): Promise<T> {
    await delay()
    const updated: Wine[] = []
    wines = wines.map((w) => {
      const matches = this._filters.every((f) => f(w))
      if (matches) {
        const updatedWine = { ...w, ...this._updates, updated_at: new Date().toISOString() }
        updated.push(updatedWine)
        return updatedWine
      }
      return w
    })
    return resolve({ data: updated, error: null })
  }
}

class MockDeleteBuilder {
  private _filters: Array<(w: Wine) => boolean> = []

  eq<K extends keyof Wine>(column: K, value: Wine[K]) {
    this._filters.push((w) => w[column] === value)
    return this
  }

  async then<T>(
    resolve: (result: { data: Wine[] | null; error: MockError }) => T
  ): Promise<T> {
    await delay()
    const deleted: Wine[] = []
    wines = wines.filter((w) => {
      const matches = this._filters.every((f) => f(w))
      if (matches) {
        deleted.push(w)
        return false
      }
      return true
    })
    return resolve({ data: deleted, error: null })
  }
}

class MockTableBuilder {
  select(columns?: string) {
    return new MockQueryBuilder(wines).select(columns)
  }

  insert(data: Partial<Wine>[]) {
    return new MockInsertBuilder(data)
  }

  update(data: Partial<Wine>) {
    return new MockUpdateBuilder(data)
  }

  delete() {
    return new MockDeleteBuilder()
  }
}

// Mock Supabase client
export const mockClient = {
  from: (_table: string) => new MockTableBuilder(),
}

// For server-side: get wines directly
export function getWinesForServer(): Wine[] {
  return wines.filter(w => w.is_active && w.bottle_count > 0)
    .sort((a, b) => {
      if (a.category < b.category) return -1
      if (a.category > b.category) return 1
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
}
