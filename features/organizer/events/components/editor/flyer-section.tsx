"use client"

import { Button } from "@/components/ui/button"
import { FlyerUploadDialog } from "@/features/organizer/events/components/editor/flyer-upload-dialog"
import type { EventItem } from "@/features/organizer/events/types"
import { useState } from "react"

export function FlyerSection({ event }: { event: EventItem }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium">Flyer</h2>
      <div className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-xl border bg-muted/40">
        {event.flyer_url ? (
          event.flyer_type === "video" ? (
            <video
              src={event.flyer_url}
              className="size-full object-cover"
              controls
            />
          ) : (
            <img
              src={event.flyer_url}
              alt=""
              className="size-full object-cover"
            />
          )
        ) : (
          <p className="text-sm text-muted-foreground">No flyer yet</p>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        {event.flyer_url ? "Change flyer" : "Upload flyer"}
      </Button>
      <FlyerUploadDialog
        eventId={event.id}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  )
}
