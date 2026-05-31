"use client"

import { useMe } from "@/features/auth"
import { PayoutsPage } from "@/features/organizer/payouts/components/payouts-page"

export default function OrganizerPayoutsRoute() {
  const { data: user } = useMe()
  const org = user?.organisations[0]

  if (!org) {
    return <p className="text-muted-foreground text-sm">Loading…</p>
  }

  return <PayoutsPage orgId={org.id} />
}
