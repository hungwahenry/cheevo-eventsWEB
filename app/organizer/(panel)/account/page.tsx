"use client"

import { AccountSettings } from "@/features/account/components/account-settings"

export default function OrganizerAccountPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="text-muted-foreground text-sm">
          Manage your personal account and security.
        </p>
      </div>

      <AccountSettings />
    </div>
  )
}
