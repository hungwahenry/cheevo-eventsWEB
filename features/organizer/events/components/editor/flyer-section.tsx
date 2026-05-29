"use client"

import { Button } from "@/components/ui/button"
import type { EventItem } from "@/features/organizer/events/types"

export function FlyerSection({ event }: { event: EventItem }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium">Flyer</h2>
      <div className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-xl border bg-muted/40">
        {event.flyer_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.flyer_url}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <p className="text-sm text-muted-foreground">No flyer yet</p>
        )}
      </div>
      <Button variant="outline" size="sm" className="w-full" disabled>
        Upload &amp; crop 4:5 — coming next
      </Button>
    </div>
  )
}
