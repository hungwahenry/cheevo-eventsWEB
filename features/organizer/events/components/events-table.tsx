"use client"

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EventTableRow } from "@/features/organizer/events/components/event-table-row"
import type { EventItem } from "@/features/organizer/events/types"

export function EventsTable({ events }: { events: EventItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead className="w-28">Status</TableHead>
            <TableHead className="w-36">Date</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <EventTableRow key={event.id} event={event} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
