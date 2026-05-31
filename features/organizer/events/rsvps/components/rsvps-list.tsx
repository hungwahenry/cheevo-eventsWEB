"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useEventRsvps } from "@/features/organizer/events/rsvps/hooks"
import type { EventRsvp } from "@/features/organizer/events/rsvps/types"
import { formatRelativeShort } from "@/lib/format/datetime"
import { useMemo } from "react"

export function RsvpsList({ eventId }: { eventId: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useEventRsvps(eventId)

  const items = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  )

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-10 text-center">
        <p className="text-sm font-medium">No one&apos;s RSVPed yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Once attendees commit, they&apos;ll show up here.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="divide-y rounded-xl border">
        {items.map((rsvp) => (
          <RsvpRow key={rsvp.id} rsvp={rsvp} />
        ))}
      </ul>

      {hasNextPage ? (
        <Button
          variant="outline"
          size="sm"
          className="self-center"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </Button>
      ) : null}
    </div>
  )
}

function RsvpRow({ rsvp }: { rsvp: EventRsvp }) {
  const displayName = rsvp.display_name ?? rsvp.username ?? "Someone"
  const initials = displayName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  const when = formatRelativeShort(rsvp.rsvped_at)

  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <Avatar className="size-9">
        {rsvp.avatar_url ? <AvatarImage src={rsvp.avatar_url} alt="" /> : null}
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{displayName}</p>
        {rsvp.username ? (
          <p className="truncate text-xs text-muted-foreground">
            @{rsvp.username}
          </p>
        ) : null}
      </div>
      {when ? (
        <span className="text-xs text-muted-foreground">{when}</span>
      ) : null}
    </li>
  )
}
