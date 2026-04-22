// app/layout.tsx

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../tailwind.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Palate — Modern Apparel',
    template: '%s | Palate',
  },
  description:
    'Curated essentials for modern living. Discover timeless pieces crafted with care.',
  openGraph: {
    title: 'Palate — Modern Apparel',
    description: 'Curated essentials for modern living.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-[#fafafa] text-[#0f0f0f] font-sans antialiased">
        {children}
      </body>
    </html>
  )
}