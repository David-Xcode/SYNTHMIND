import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Synthmind - Reshaping the Future with AI',
  description: 'AI solutions to reshape the future',
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