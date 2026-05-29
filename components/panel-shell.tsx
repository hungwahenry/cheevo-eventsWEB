"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useMe, useSignOut } from "@/features/auth"
import type { LucideIcon } from "lucide-react"
import { LogOutIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  /** Only highlight on an exact path match (use for the index/dashboard route). */
  exact?: boolean
}

/** The workspace shown in the sidebar header — the organisation for organizers. */
export type PanelBrand = {
  name: string
  logoUrl?: string | null
}

function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

function initials(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
}

export function PanelShell({
  brand,
  nav,
  children,
}: {
  brand: PanelBrand
  nav: NavItem[]
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: user } = useMe()
  const { signOut, isPending } = useSignOut()

  const current = nav.find((item) => isActive(pathname, item))
  const displayName = user?.profile.first_name
    ? `${user.profile.first_name} ${user.profile.last_name ?? ""}`.trim()
    : user?.email

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Avatar className="size-8 rounded-md">
              {brand.logoUrl ? (
                <AvatarImage src={brand.logoUrl} alt={brand.name} />
              ) : null}
              <AvatarFallback className="rounded-md text-xs">
                {initials(brand.name)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate font-semibold tracking-tight">
              {brand.name}
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(pathname, item)}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Avatar className="size-7">
              {user?.profile.avatar_url ? (
                <AvatarImage src={user.profile.avatar_url} alt="" />
              ) : null}
              <AvatarFallback className="text-xs">
                {initials(displayName ?? "?")}
              </AvatarFallback>
            </Avatar>
            {displayName ? (
              <span className="truncate text-sm text-muted-foreground">
                {displayName}
              </span>
            ) : null}
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={signOut} disabled={isPending}>
                <LogOutIcon />
                <span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          {current ? (
            <h1 className="text-sm font-medium">{current.title}</h1>
          ) : null}
        </header>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
