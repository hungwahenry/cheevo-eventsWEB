"use client"

import { NotificationPreferencesTable } from "@/features/notifications/components/notification-preferences-table"

export function NotificationsSection() {
  return (
    <section className="bg-card rounded-xl p-5">
      <h2 className="mb-1 text-sm font-semibold">Notifications</h2>
      <p className="text-muted-foreground mb-4 text-xs">
        Choose which emails we send you. Changes save instantly.
      </p>
      <NotificationPreferencesTable audience="organizer" />
    </section>
  )
}
