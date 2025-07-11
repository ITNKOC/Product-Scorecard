import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Logo from '@/components/ui/Logo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Product Scorecard - Analyse de Produits E-commerce',
  description: 'Outil d\'analyse et de validation de produits pour entrepreneurs e-commerce',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}