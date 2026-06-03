import { AnnouncementComposer } from "@/features/admin/notifications/components/announcement-composer"
import { ExpoHealthCard } from "@/features/admin/notifications/components/expo-health-card"

export default function AdminNotificationsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground text-sm">
          Broadcast a system announcement and monitor push token health.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <AnnouncementComposer />
        <ExpoHealthCard />
      </div>
    </div>
  )
}
