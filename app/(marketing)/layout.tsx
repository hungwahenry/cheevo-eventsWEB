import { Geist } from "next/font/google"

import { cn } from "@/lib/utils"

import "./marketing.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-marketing",
})

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={cn("marketing-shell", geist.variable)}>{children}</div>
  )
}
