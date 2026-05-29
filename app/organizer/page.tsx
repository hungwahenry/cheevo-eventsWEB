"use client"

import { useMe } from "@/features/auth"

export default function OrganizerDashboardPage() {
  const { data: user, isLoading } = useMe()
  const firstName = user?.profile.first_name

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold tracking-tight">
        {isLoading ? "Loading…" : `Welcome${firstName ? `, ${firstName}` : ""}`}
      </h1>
      <p className="text-sm text-muted-foreground">
        Your organizer dashboard will live here.
      </p>
    </div>
  )
}
