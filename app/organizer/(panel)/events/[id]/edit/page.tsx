"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { EventEditor } from "@/features/organizer/events/components/event-editor"
import { useEvent } from "@/features/organizer/events/hooks"
import { useParams } from "next/navigation"

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>()
  const { data: event, isLoading } = useEvent(id)

  if (isLoading || !event) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-44 w-full" />
      </div>
    )
  }

  return <EventEditor event={event} />
}
