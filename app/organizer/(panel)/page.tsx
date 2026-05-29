"use client"

import { useMe } from "@/features/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function OrganizerDashboardPage() {
  const { data: user, isLoading } = useMe()
  const router = useRouter()

  // Not an organizer yet → send them through onboarding to create an organisation.
  useEffect(() => {
    if (!isLoading && user && !user.is_organizer) {
      router.replace("/organizer/onboarding")
    }
  }, [isLoading, user, router])

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
