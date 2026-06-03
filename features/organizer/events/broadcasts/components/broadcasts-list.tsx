"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { BroadcastStatusBadge } from "@/features/organizer/events/broadcasts/components/broadcast-status-badge"
import { ComposeBroadcastDialog } from "@/features/organizer/events/broadcasts/components/compose-broadcast-dialog"
import { useEventBroadcasts } from "@/features/organizer/events/broadcasts/hooks"
import { useFeature } from "@/features/system/hooks"
import type {
  Broadcast,
  BroadcastAudience,
} from "@/features/organizer/events/broadcasts/types"
import { formatRelativeShort } from "@/lib/format/datetime"
import { useState } from "react"

const AUDIENCE_LABEL: Record<BroadcastAudience, string> = {
  ticket_holders: "Ticket holders",
  rsvpers: "RSVPers",
  both: "Both",
}

export function BroadcastsList({ eventId }: { eventId: string }) {
  const [page, setPage] = useState(1)
  const { data, isLoading, isFetching } = useEventBroadcasts(eventId, page)
  const broadcastsEnabled = useFeature("broadcasts.enabled")

  const columns: DataTableColumn<Broadcast>[] = [
    {
      id: "sent",
      header: "Sent",
      cell: (b) => (
        <span className="text-muted-foreground text-xs">
          {formatRelativeShort(b.sent_at ?? b.created_at)}
        </span>
      ),
    },
    {
      id: "subject",
      header: "Subject",
      cell: (b) => (
        <p className="max-w-md truncate text-sm font-medium">{b.subject}</p>
      ),
    },
    {
      id: "audience",
      header: "Audience",
      cell: (b) => (
        <span className="text-muted-foreground text-sm">
          {AUDIENCE_LABEL[b.audience]}
        </span>
      ),
    },
    {
      id: "recipients",
      header: "Recipients",
      headerClassName: "text-right",
      cellClassName: "text-right",
      cell: (b) => (
        <span className="text-sm tabular-nums">
          {b.sent_count.toLocaleString()}
          {b.recipients_count > 0 && b.sent_count !== b.recipients_count ? (
            <span className="text-muted-foreground">
              {" "}
              / {b.recipients_count.toLocaleString()}
            </span>
          ) : null}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (b) => <BroadcastStatusBadge status={b.status} />,
    },
  ]

  return (
    <DataTable<Broadcast>
      columns={columns}
      data={data?.items ?? []}
      keyExtractor={(b) => b.id}
      isLoading={isLoading}
      isFetching={isFetching}
      page={data?.page ?? page}
      lastPage={data?.last_page ?? 1}
      total={data?.total}
      onPageChange={setPage}
      filters={broadcastsEnabled ? <ComposeBroadcastDialog eventId={eventId} /> : null}
      empty={{
        title: "No broadcasts yet",
        description:
          "Send an email to your ticket buyers and RSVPers — address reveals, doors-soon nudges, last-minute updates.",
      }}
    />
  )
}
