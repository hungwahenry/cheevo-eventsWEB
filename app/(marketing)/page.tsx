import type { Metadata } from "next"

import { Hero } from "@/features/marketing/components/hero"
import { MarketingFooter } from "@/features/marketing/components/marketing-footer"
import { MarketingHeader } from "@/features/marketing/components/marketing-header"
import { BroadcastsSection } from "@/features/marketing/components/sections/broadcasts-section"
import { DashboardPreview } from "@/features/marketing/components/sections/dashboard-preview"
import { DoorSection } from "@/features/marketing/components/sections/door-section"
import { FinalCta } from "@/features/marketing/components/sections/final-cta"
import { PayoutsSection } from "@/features/marketing/components/sections/payouts-section"
import { PricingSection } from "@/features/marketing/components/sections/pricing-section"
import { TeamSection } from "@/features/marketing/components/sections/team-section"
import { TicketsSection } from "@/features/marketing/components/sections/tickets-section"

const TITLE = "cheevo for organisers — sell tickets, get paid, move on"
const DESCRIPTION =
  "All-in-one event hosting for Nigeria: tickets, payouts, broadcasts, door scanning and attendees. One dashboard."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  keywords: [
    "sell tickets",
    "event ticketing",
    "event organiser",
    "event management",
    "payouts",
    "door scanning",
    "Nigeria",
    "Lagos",
    "cheevo",
  ],
  openGraph: {
    type: "website",
    siteName: "cheevo for organisers",
    title: TITLE,
    description: DESCRIPTION,
    url: "https://cheevo.vip",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
}

export default function MarketingHome() {
  return (
    <main>
      <MarketingHeader />
      <Hero />
      <DashboardPreview />
      <TicketsSection />
      <PayoutsSection />
      <BroadcastsSection />
      <DoorSection />
      <TeamSection />
      <PricingSection />
      <FinalCta />
      <MarketingFooter />
    </main>
  )
}
