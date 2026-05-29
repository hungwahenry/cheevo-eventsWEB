"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteEventButton } from "@/features/organizer/events/components/delete-event-button"
import type { EventItem } from "@/features/organizer/events/types"
import Link from "next/link"

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function EventsTable({ events }: { events: EventItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-0" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">
              <Link
                href={`/organizer/events/${event.id}/edit`}
                className="hover:underline"
              >
                {event.title}
              </Link>
            </TableCell>
            <TableCell>
              <Badge
                variant={event.status === "published" ? "default" : "secondary"}
              >
                {event.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(event.starts_at)}
            </TableCell>
            <TableCell className="text-right">
              <DeleteEventButton eventId={event.id} title={event.title} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
