import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from 'next/font/google'
import './globals.css'
import FloatingChatbot from "@/components/FloatingChatbot"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Contract Nexus',
  description: 'A modern take on infrastructure/innovation bidding',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FloatingChatbot />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}