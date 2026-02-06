'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { Wine, CATEGORY_LABELS } from '@/types/wine'

interface ExportButtonProps {
  wines: Wine[]
}

type ExportFormat = 'excel' | 'superb' | 'trivec' | 'ancon' | 'winpos'

const formatLabels: Record<ExportFormat, string> = {
  excel: 'Standard Excel',
  superb: 'Superb POS',
  trivec: 'Trivec POS',
  ancon: 'Ancon POS',
  winpos: 'WinPOS',
}

export default function ExportButton({ wines }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  const exportToExcel = (format: ExportFormat) => {
    setExporting(true)

    try {
      let data: Record<string, unknown>[]
      let filename: string

      switch (format) {
        case 'superb':
          // Superb POS format - typically uses item name, category, price
          data = wines.filter(w => w.is_active).map(wine => ({
            'Item Name': wine.name,
            'Category': CATEGORY_LABELS[wine.category],
            'Description': `${wine.producer}${wine.vintage ? ` ${wine.vintage}` : ''}${wine.region ? `, ${wine.region}` : ''}`,
            'Price': wine.bottle_price || 0,
            'Glass Price': wine.glass_price || 0,
            'VAT': '25%',
            'Stock': wine.bottle_count,
            'Notes': wine.tasting_notes || '',
          }))
          filename = 'wines-superb.xlsx'
          break

        case 'trivec':
          // Trivec POS format
          data = wines.filter(w => w.is_active).map(wine => ({
            'ArticleNo': wine.id,
            'Name': wine.name,
            'Group': `Wine - ${CATEGORY_LABELS[wine.category]}`,
            'Producer': wine.producer,
            'Vintage': wine.vintage || 'NV',
            'PriceIncVAT': wine.bottle_price || 0,
            'GlassPriceIncVAT': wine.glass_price || 0,
            'VATCode': '25',
            'InStock': wine.bottle_count,
            'Active': wine.is_active ? 'Yes' : 'No',
          }))
          filename = 'wines-trivec.xlsx'
          break

        case 'ancon':
          // Ancon POS format
          data = wines.filter(w => w.is_active).map(wine => ({
            'PLU': wine.id,
            'Artikelnamn': wine.name,
            'Kategori': CATEGORY_LABELS[wine.category],
            'Producent': wine.producer,
            'Argang': wine.vintage || '',
            'Region': wine.region || '',
            'Land': wine.country || '',
            'Druvsorter': wine.grape_variety || '',
            'Flaskpris': wine.bottle_price || 0,
            'Glaspris': wine.glass_price || 0,
            'Lagersaldo': wine.bottle_count,
            'Beskrivning': wine.tasting_notes || '',
          }))
          filename = 'wines-ancon.xlsx'
          break

        case 'winpos':
          // WinPOS format
          data = wines.filter(w => w.is_active).map((wine, index) => ({
            'ItemID': index + 1,
            'ItemName': wine.name,
            'ItemGroup': 'Wine',
            'SubGroup': CATEGORY_LABELS[wine.category],
            'Supplier': wine.producer,
            'Year': wine.vintage || '',
            'SalePrice1': wine.bottle_price || 0,
            'SalePrice2': wine.glass_price || 0,
            'VATPct': 25,
            'StockQty': wine.bottle_count,
            'Description': wine.tasting_notes || '',
            'Origin': wine.country || '',
          }))
          filename = 'wines-winpos.xlsx'
          break

        default:
          // Standard Excel format with all fields
          data = wines.map(wine => ({
            'Name': wine.name,
            'Producer': wine.producer,
            'Category': CATEGORY_LABELS[wine.category],
            'Vintage': wine.vintage || 'NV',
            'Region': wine.region || '',
            'Country': wine.country || '',
            'Grape Variety': wine.grape_variety || '',
            'Bottle Price': wine.bottle_price || '',
            'Glass Price': wine.glass_price || '',
            'Stock': wine.bottle_count,
            'Active': wine.is_active ? 'Yes' : 'No',
            'Tasting Notes': wine.tasting_notes || '',
          }))
          filename = 'wines-export.xlsx'
      }

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Wines')

      // Auto-size columns
      const colWidths = Object.keys(data[0] || {}).map(key => ({
        wch: Math.max(key.length, ...data.map(row => String(row[key] || '').length)) + 2
      }))
      ws['!cols'] = colWidths

      // Download
      XLSX.writeFile(wb, filename)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setExporting(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-cream-dark text-charcoal rounded-lg hover:border-warm-gray hover:bg-cream-dark transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-cream-dark z-20 overflow-hidden">
            <div className="px-3 py-2 bg-cream-dark/50 border-b border-cream-dark">
              <span className="text-xs font-semibold text-charcoal uppercase tracking-wide">Export Format</span>
            </div>
            {(Object.keys(formatLabels) as ExportFormat[]).map((format) => (
              <button
                key={format}
                onClick={() => exportToExcel(format)}
                disabled={exporting}
                className="w-full px-4 py-2.5 text-left text-sm text-charcoal hover:bg-cream-dark transition-colors flex items-center justify-between group"
              >
                <span>{formatLabels[format]}</span>
                <svg className="w-4 h-4 text-warm-gray group-hover:text-wine transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
