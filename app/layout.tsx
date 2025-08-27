import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PhotoClean - AI Photo Editor',
  description: 'Remove unwanted people from your photos with AI',
  keywords: 'AI, photo editing, remove people, image processing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}