import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/lib/providers"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://cheevo.vip"),
  title: {
    default: "cheevo for organisers — sell tickets, get paid, move on",
    template: "%s — cheevo",
  },
  description:
    "All-in-one event hosting for Nigeria: tickets, payouts, broadcasts, door scanning and attendees. One dashboard.",
  applicationName: "cheevo for organisers",
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <Providers>{children}</Providers>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
