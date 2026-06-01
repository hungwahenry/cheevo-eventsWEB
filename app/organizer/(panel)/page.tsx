"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useMe } from "@/features/auth"
import { Dashboard } from "@/features/organizer/dashboard/components/dashboard"

export default function OrganizerDashboardPage() {
  const { data: user, isLoading } = useMe()
  const organisation = user?.organisations[0]

  if (isLoading || !organisation) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-9 w-48" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <Dashboard
      orgId={organisation.id}
      userFirstName={user?.profile.first_name ?? null}
    />
  )
}
