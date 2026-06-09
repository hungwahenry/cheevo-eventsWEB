"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyEventLinkButton } from "@/features/organizer/events/components/copy-event-link-button"
import { formatEventStatus } from "@/features/organizer/events/format"
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
  const past = event.status === "past"

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
          <Badge
            variant={published ? "default" : past ? "outline" : "secondary"}
          >
            {formatEventStatus(event.status)}
          </Badge>
        </div>
        <div className="flex gap-2">
          {published || past ? (
            <CopyEventLinkButton slug={event.slug} />
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving || past}
          >
            {isSaving ? "Saving…" : "Save"}
          </Button>
          <Button
            size="sm"
            onClick={onPublish}
            disabled={published || past || isPublishing}
          >
            {published ? "Published" : past ? "Ended" : isPublishing ? "Publishing…" : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  )
}
