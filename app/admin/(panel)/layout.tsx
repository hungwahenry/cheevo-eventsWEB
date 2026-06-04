"use client"

import { PanelShell, type NavSection } from "@/components/panel-shell"
import { useMe } from "@/features/auth"
import {
  BanknoteIcon,
  BellIcon,
  BookmarkIcon,
  Building2Icon,
  CalendarIcon,
  CreditCardIcon,
  FileIcon,
  FileTextIcon,
  FlagIcon,
  HelpCircleIcon,
  ImageIcon,
  LayoutDashboardIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  ScrollTextIcon,
  SearchIcon,
  SparklesIcon,
  TagIcon,
  TicketIcon,
  ToggleLeftIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const SECTIONS: NavSection[] = [
  {
    items: [
      {
        title: "Overview",
        href: "/admin",
        icon: LayoutDashboardIcon,
        exact: true,
      },
    ],
  },
  {
    label: "Moderation",
    items: [
      { title: "Reports", href: "/admin/reports", icon: FlagIcon },
      { title: "Comments", href: "/admin/comments", icon: MessageSquareIcon },
    ],
  },
  {
    label: "People",
    items: [
      { title: "Users", href: "/admin/users", icon: UsersIcon },
      {
        title: "Organisations",
        href: "/admin/organisations",
        icon: Building2Icon,
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      { title: "Events", href: "/admin/events", icon: CalendarIcon },
      {
        title: "Issued tickets",
        href: "/admin/issued-tickets",
        icon: TicketIcon,
      },
      {
        title: "Broadcasts",
        href: "/admin/broadcasts",
        icon: MegaphoneIcon,
      },
    ],
  },
  {
    label: "Money",
    items: [
      { title: "Orders", href: "/admin/orders", icon: ScrollTextIcon },
      { title: "Payments", href: "/admin/payments", icon: CreditCardIcon },
      { title: "Payouts", href: "/admin/payouts", icon: BanknoteIcon },
    ],
  },
  {
    label: "Settings",
    items: [
      { title: "Interests", href: "/admin/catalog/interests", icon: SparklesIcon },
      {
        title: "Org categories",
        href: "/admin/catalog/categories",
        icon: TagIcon,
      },
      {
        title: "Social platforms",
        href: "/admin/catalog/social-platforms",
        icon: BookmarkIcon,
      },
      {
        title: "Report reasons",
        href: "/admin/catalog/report-reasons",
        icon: HelpCircleIcon,
      },
      { title: "Welcome screen", href: "/admin/welcome", icon: ImageIcon },
      { title: "Pages", href: "/admin/pages", icon: FileIcon },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Notifications",
        href: "/admin/notifications",
        icon: BellIcon,
      },
      { title: "Search", href: "/admin/search", icon: SearchIcon },
      { title: "Ops", href: "/admin/ops", icon: WrenchIcon },
      { title: "Flags & config", href: "/admin/system", icon: ToggleLeftIcon },
      { title: "Audit log", href: "/admin/audit-log", icon: FileTextIcon },
    ],
  },
]

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: user, isLoading } = useMe()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.replace("/login")
      return
    }
    if (user.role !== "admin") {
      router.replace("/")
    }
  }, [isLoading, user, router])

  return (
    <PanelShell brand={{ name: "cheevo admin" }} sections={SECTIONS}>
      {children}
    </PanelShell>
  )
}
