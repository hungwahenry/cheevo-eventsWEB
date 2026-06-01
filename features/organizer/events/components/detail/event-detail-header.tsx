"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  formatEventStatus,
  formatEventWhen,
} from "@/features/organizer/events/format"
import type { EventItem } from "@/features/organizer/events/types"
import { ChevronLeftIcon, PencilIcon } from "lucide-react"
import Link from "next/link"

export function EventDetailHeader({ event }: { event: EventItem }) {
  const when = formatEventWhen(event.starts_at, event.ends_at)

  return (
    <div className="sticky top-0 z-10 -mx-6 -mt-8 border-b bg-background">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/organizer/events">
              <ChevronLeftIcon className="size-4" />
              <span className="hidden sm:inline">Events</span>
            </Link>
          </Button>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{event.title}</span>
            <span className="truncate text-xs text-muted-foreground">
              {when.date}
              {when.time ? ` · ${when.time}` : ""}
            </span>
          </div>
          <Badge
            variant={
              event.status === "published"
                ? "default"
                : event.status === "past"
                  ? "outline"
                  : "secondary"
            }
          >
            {formatEventStatus(event.status)}
          </Badge>
        </div>
        <Button asChild size="sm" variant={event.status === "past" ? "outline" : "default"}>
          <Link href={`/organizer/events/${event.id}/edit`}>
            <PencilIcon className="size-4" />
            {event.status === "past" ? "View event" : "Edit event"}
          </Link>
        </Button>
      </div>
    </div>
  )
}
