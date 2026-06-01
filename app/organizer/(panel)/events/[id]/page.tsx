"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { EventDetail } from "@/features/organizer/events/components/detail/event-detail"
import { useEvent } from "@/features/organizer/events/hooks"
import { useParams } from "next/navigation"

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: event, isLoading } = useEvent(id)

  if (isLoading || !event) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="aspect-[3/1] w-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return <EventDetail event={event} />
}
