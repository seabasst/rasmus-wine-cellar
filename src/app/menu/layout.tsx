import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wine Menu',
  description: 'Our curated wine selection',
}

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
