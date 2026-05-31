"use client"

import { useMe } from "@/features/auth"
import { Dashboard } from "@/features/organizer/dashboard/components/dashboard"

export default function OrganizerDashboardPage() {
  const { data: user, isLoading } = useMe()
  const organisation = user?.organisations[0]

  if (isLoading || !organisation) {
    return <p className="text-muted-foreground text-sm">Loading…</p>
  }

  return (
    <Dashboard
      orgId={organisation.id}
      userFirstName={user?.profile.first_name ?? null}
    />
  )
}
