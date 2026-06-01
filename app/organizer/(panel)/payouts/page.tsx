"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useMe } from "@/features/auth"
import { PayoutsPage } from "@/features/organizer/payouts/components/payouts-page"

export default function OrganizerPayoutsRoute() {
  const { data: user } = useMe()
  const org = user?.organisations[0]

  if (!org) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    )
  }

  return <PayoutsPage orgId={org.id} />
}
