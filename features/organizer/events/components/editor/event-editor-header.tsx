"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { EventItem } from "@/features/organizer/events/types"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"

type EventEditorHeaderProps = {
  event: EventItem
  onSave: () => void
  onPublish: () => void
  isSaving: boolean
  isPublishing: boolean
}

export function EventEditorHeader({
  event,
  onSave,
  onPublish,
  isSaving,
  isPublishing,
}: EventEditorHeaderProps) {
  const published = event.status === "published"

  return (
    <div className="sticky top-0 z-10 -mx-6 -mt-8 border-b bg-background">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/organizer/events">
              <ChevronLeftIcon />
              Events
            </Link>
          </Button>
          <span className="truncate text-sm font-semibold">{event.title}</span>
          <Badge variant={published ? "default" : "secondary"}>
            {event.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving…" : "Save"}
          </Button>
          <Button
            size="sm"
            onClick={onPublish}
            disabled={published || isPublishing}
          >
            {published ? "Published" : isPublishing ? "Publishing…" : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  )
}
