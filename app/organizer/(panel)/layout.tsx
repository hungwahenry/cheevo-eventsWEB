"use client"

import { PanelShell, type NavItem } from "@/components/panel-shell"
import { useMe } from "@/features/auth"
import {
  BanknoteIcon,
  CalendarIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const NAV: NavItem[] = [
  {
    title: "Dashboard",
    href: "/organizer",
    icon: LayoutDashboardIcon,
    exact: true,
  },
  { title: "Events", href: "/organizer/events", icon: CalendarIcon },
  { title: "Payouts", href: "/organizer/payouts", icon: BanknoteIcon },
  { title: "Settings", href: "/organizer/settings", icon: SettingsIcon },
]

export default function OrganizerPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: user, isLoading } = useMe()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user && !user.is_organizer) {
      router.replace("/organizer/onboarding")
    }
  }, [isLoading, user, router])

  const org = user?.organisations[0]

  return (
    <PanelShell
      brand={{ name: org?.name ?? "cheevo", logoUrl: org?.logo_url }}
      nav={NAV}
    >
      {children}
    </PanelShell>
  )
}
