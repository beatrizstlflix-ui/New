import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'STLFLIX BR — Dashboard Organico do YouTube',
  description: 'Visao dos dados organicos do canal STLFLIX BR (YouTube Studio)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-base text-white min-h-screen">{children}</body>
    </html>
  )
}
