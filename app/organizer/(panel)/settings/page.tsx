"use client"

import { useMe } from "@/features/auth"
import { SettingsForm } from "@/features/organizer/settings/components/settings-form"

export default function OrganizerSettingsPage() {
  const { data: user, isLoading } = useMe()
  const organisation = user?.organisations[0]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your organisation profile.
        </p>
      </div>

      {isLoading || !organisation ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : (
        <SettingsForm organisation={organisation} />
      )}
    </div>
  )
}
