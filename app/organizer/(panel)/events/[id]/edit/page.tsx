"use client"

import { EventEditor } from "@/features/organizer/events/components/event-editor"
import { useEvent } from "@/features/organizer/events/hooks"
import { useParams } from "next/navigation"

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>()
  const { data: event, isLoading } = useEvent(id)

  if (isLoading || !event) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
  }

  return <EventEditor event={event} />
}
