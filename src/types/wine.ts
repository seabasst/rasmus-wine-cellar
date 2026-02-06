export type WineCategory =
  | 'red'
  | 'white'
  | 'rose'
  | 'sparkling'
  | 'dessert'
  | 'fortified'
  | 'orange'

export interface Wine {
  id: string
  name: string
  producer: string
  region: string | null
  country: string | null
  vintage: number | null
  category: WineCategory
  grape_variety: string | null
  bottle_count: number
  glass_price: number | null
  bottle_price: number | null
  tasting_notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type WineInsert = Omit<Wine, 'id' | 'created_at' | 'updated_at'>
export type WineUpdate = Partial<WineInsert>

export const CATEGORY_LABELS: Record<WineCategory, string> = {
  red: 'Red Wine',
  white: 'White Wine',
  rose: 'Rosé',
  sparkling: 'Sparkling',
  dessert: 'Dessert Wine',
  fortified: 'Fortified',
  orange: 'Orange Wine',
}

export const CATEGORY_COLORS: Record<WineCategory, string> = {
  red: 'bg-red-100 text-red-800',
  white: 'bg-yellow-100 text-yellow-800',
  rose: 'bg-pink-100 text-pink-800',
  sparkling: 'bg-amber-100 text-amber-800',
  dessert: 'bg-orange-100 text-orange-800',
  fortified: 'bg-purple-100 text-purple-800',
  orange: 'bg-orange-100 text-orange-800',
}
