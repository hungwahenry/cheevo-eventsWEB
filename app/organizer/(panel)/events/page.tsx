"use client"

import { CreateEventDialog } from "@/features/organizer/events/components/create-event-dialog"
import { EventsTable } from "@/features/organizer/events/components/events-table"

export default function OrganizerEventsPage() {
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

      <EventsTable />
    </div>
  )
}
