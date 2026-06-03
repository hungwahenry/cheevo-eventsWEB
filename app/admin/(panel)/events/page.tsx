import { EventsTable } from "@/features/admin/events/components/events-table"

export default function AdminEventsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
        <p className="text-muted-foreground text-sm">
          Cross-organisation event admin — unpublish, mark past, lock comments,
          delete.
        </p>
      </div>
      <EventsTable />
    </div>
  )
}
