"use client"

import { CsvExportButton } from "@/components/csv-export-button"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEventRsvps } from "@/features/organizer/events/rsvps/hooks"
import type { EventRsvp } from "@/features/organizer/events/rsvps/types"
import { formatRelativeShort } from "@/lib/format/datetime"
import { useState } from "react"

export function RsvpsList({ eventId }: { eventId: string }) {
  const [page, setPage] = useState(1)
  const { data, isLoading, isFetching } = useEventRsvps(eventId, page)

  const columns: DataTableColumn<EventRsvp>[] = [
    {
      id: "user",
      header: "Attendee",
      cell: (r) => <UserCell rsvp={r} />,
    },
    {
      id: "username",
      header: "Username",
      cell: (r) =>
        r.username ? (
          <span className="text-muted-foreground text-sm">@{r.username}</span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    {
      id: "rsvped",
      header: "RSVPed",
      cell: (r) => (
        <span className="text-muted-foreground text-xs">
          {formatRelativeShort(r.rsvped_at)}
        </span>
      ),
    },
  ]

  return (
    <DataTable<EventRsvp>
      columns={columns}
      data={data?.items ?? []}
      keyExtractor={(r) => r.id}
      isLoading={isLoading}
      isFetching={isFetching}
      page={data?.page ?? page}
      lastPage={data?.last_page ?? 1}
      total={data?.total}
      onPageChange={setPage}
      filters={
        <CsvExportButton
          href={`/api/organizer/events/${eventId}/rsvps/export`}
        />
      }
      empty={{
        title: "No one's RSVPed yet",
        description: "Once attendees commit, they'll show up here.",
      }}
    />
  )
}

function UserCell({ rsvp }: { rsvp: EventRsvp }) {
  const name = rsvp.display_name ?? rsvp.username ?? "Someone"
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="flex items-center gap-2.5">
      <Avatar size="sm">
        {rsvp.avatar_url ? <AvatarImage src={rsvp.avatar_url} alt="" /> : null}
        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
      </Avatar>
      <p className="truncate text-sm font-medium">{name}</p>
    </div>
  )
}
