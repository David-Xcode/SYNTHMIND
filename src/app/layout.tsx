import type { Metadata } from 'next'
import { Sora, Manrope, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// Display 字体 — 标题、Hero 大文字 (替代 DM Serif Display)
const sora = Sora({
  weight: ['300', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})

// 正文/UI 字体 — 几何人文无衬线 (替代 DM Sans)
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

// 数据/标签字体 — 编程风格等宽 (替代 DM Mono)
const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://synthmind.ca'),
  title: 'Synthmind | AI-Powered Software Development & Automation',
  description: 'Solo software studio building AI tools that actually work. Specializing in workflow automation, legacy system modernization, and custom AI solutions for traditional industries.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Synthmind | AI Solutions That Actually Work',
    description: 'Solo software studio building AI tools for traditional industries. No corporate fluff—just working software.',
    url: 'https://synthmind.ca',
    siteName: 'Synthmind',
    locale: 'en_CA',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1024,
        height: 541,
        alt: 'Synthmind — AI-Powered Software Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Synthmind | AI-Powered Software Development',
    description: 'Solo software studio building AI tools that actually work.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
