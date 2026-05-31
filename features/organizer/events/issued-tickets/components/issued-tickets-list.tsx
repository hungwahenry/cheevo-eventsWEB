"use client"

import {
  DataTable,
  type DataTableColumn,
} from "@/components/data-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { IssuedTicketStatusBadge } from "@/features/organizer/events/issued-tickets/components/issued-ticket-status-badge"
import { useIssuedTickets } from "@/features/organizer/events/issued-tickets/hooks"
import type {
  IssuedTicket,
  IssuedTicketStatus,
} from "@/features/organizer/events/issued-tickets/types"
import { formatRelativeShort } from "@/lib/format/datetime"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type StatusFilter = IssuedTicketStatus | "all"

export function IssuedTicketsList({ eventId }: { eventId: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<StatusFilter>("all")
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 250)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
  }, [status, search])

  const { data, isLoading, isFetching } = useIssuedTickets(
    eventId,
    page,
    status === "all" ? undefined : status,
    search || undefined
  )

  const columns: DataTableColumn<IssuedTicket>[] = [
    {
      id: "holder",
      header: "Holder",
      cell: (t) => <HolderCell ticket={t} />,
    },
    {
      id: "ticket",
      header: "Ticket",
      cell: (t) => (
        <span className="font-medium">{t.ticket_name || "—"}</span>
      ),
    },
    {
      id: "code",
      header: "Code",
      cell: (t) => (
        <span className="font-mono text-xs text-muted-foreground">
          {t.code}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (t) => <IssuedTicketStatusBadge status={t.status} />,
    },
    {
      id: "issued",
      header: "Issued",
      cell: (t) => (
        <span className="text-muted-foreground text-xs">
          {formatRelativeShort(t.created_at)}
        </span>
      ),
    },
  ]

  return (
    <DataTable<IssuedTicket>
      columns={columns}
      data={data?.items ?? []}
      keyExtractor={(t) => t.id}
      isLoading={isLoading}
      isFetching={isFetching}
      page={data?.page ?? page}
      lastPage={data?.last_page ?? 1}
      total={data?.total}
      onPageChange={setPage}
      search={searchInput}
      onSearchChange={setSearchInput}
      searchPlaceholder="Search by code, email, name…"
      filters={
        <ToggleGroup
          type="single"
          value={status}
          onValueChange={(v) => v && setStatus(v as StatusFilter)}
          variant="outline"
          size="sm">
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="valid">Valid</ToggleGroupItem>
          <ToggleGroupItem value="scanned">Used</ToggleGroupItem>
          <ToggleGroupItem value="revoked">Revoked</ToggleGroupItem>
        </ToggleGroup>
      }
      empty={{
        title: "No tickets yet",
        description: "Tickets issued for paid orders will show up here.",
      }}
      onRowClick={(t) =>
        router.push(`/organizer/events/${eventId}/tickets/${t.id}`)
      }
    />
  )
}

function HolderCell({ ticket }: { ticket: IssuedTicket }) {
  const name =
    ticket.holder.display_name ??
    ticket.holder.username ??
    ticket.holder.email ??
    "—"
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="flex items-center gap-2.5">
      <Avatar size="sm">
        {ticket.holder.avatar_url ? (
          <AvatarImage src={ticket.holder.avatar_url} alt="" />
        ) : null}
        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{name}</p>
        {ticket.holder.email && ticket.holder.email !== name ? (
          <p className="truncate text-xs text-muted-foreground">
            {ticket.holder.email}
          </p>
        ) : null}
      </div>
    </div>
  )
}
