import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Synthmind | AI-Powered Software Development & Automation',
  description: 'Solo software studio building AI tools that actually work. Specializing in workflow automation, legacy system modernization, and custom AI solutions for traditional industries.',
  keywords: ['AI software development', 'workflow automation', 'legacy system modernization', 'AI consulting', 'solo developer', 'Toronto'],
  authors: [{ name: 'David', url: 'https://synthmind.ca' }],
  creator: 'David',
  openGraph: {
    title: 'Synthmind | AI Solutions That Actually Work',
    description: 'Solo software studio building AI tools for traditional industries. No corporate fluff—just working software.',
    url: 'https://synthmind.ca',
    siteName: 'Synthmind',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Synthmind | AI-Powered Software Development',
    description: 'Solo software studio building AI tools that actually work.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
} 