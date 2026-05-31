"use client"

import { EventDetail } from "@/features/organizer/events/components/detail/event-detail"
import { useEvent } from "@/features/organizer/events/hooks"
import { useParams } from "next/navigation"

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: event, isLoading } = useEvent(id)

  if (isLoading || !event) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
  }

  return <EventDetail event={event} />
}
