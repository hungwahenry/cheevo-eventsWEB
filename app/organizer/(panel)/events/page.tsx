"use client"

import { CreateEventDialog } from "@/features/organizer/events/components/create-event-dialog"
import { EventsTable } from "@/features/organizer/events/components/events-table"
import { useEvents } from "@/features/organizer/events/hooks"

export default function OrganizerEventsPage() {
  const { data: events, isLoading } = useEvents()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage your events.
          </p>
        </div>
        <CreateEventDialog />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !events || events.length === 0 ? (
        <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed py-16 text-center">
          <p className="font-medium">No events yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first event to get started.
          </p>
        </div>
      ) : (
        <EventsTable events={events} />
      )}
    </div>
  )
}
