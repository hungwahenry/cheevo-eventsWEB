"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { EventStatusBadge } from "@/features/admin/events/components/event-status-badge"
import { useEvents } from "@/features/admin/events/hooks"
import type {
  AdminEvent,
  AdminEventStatus,
} from "@/features/admin/events/types"
import { formatMoney } from "@/lib/format/money"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type StatusFilter = AdminEventStatus | "all"

export function EventsTable() {
  const router = useRouter()
  const [status, setStatus] = useState<StatusFilter>("all")
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [status, q])

  const { data, isLoading, isFetching } = useEvents({
    status: status === "all" ? undefined : status,
    q: q.trim() || undefined,
    page,
  })

  const columns: DataTableColumn<AdminEvent>[] = [
    {
      id: "title",
      header: "Event",
      cell: (e) => (
        <div className="grid gap-0.5">
          <span className="line-clamp-1 font-medium">{e.title}</span>
          {e.organisation ? (
            <span className="text-muted-foreground text-xs">
              {e.organisation.name}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      id: "starts",
      header: "Starts",
      cell: (e) => (
        <span className="text-muted-foreground text-xs">
          {e.starts_at ? new Date(e.starts_at).toLocaleString() : "—"}
        </span>
      ),
      cellClassName: "hidden md:table-cell w-40",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "sales",
      header: "Sold",
      cell: (e) => (
        <span className="tabular-nums text-xs">
          {e.tickets_sold}/{e.tickets_count}
        </span>
      ),
      cellClassName: "hidden lg:table-cell w-20 text-right",
      headerClassName: "hidden lg:table-cell text-right",
    },
    {
      id: "revenue",
      header: "Revenue",
      cell: (e) => (
        <span className="tabular-nums text-xs">
          {formatMoney(e.revenue_minor, e.currency ?? "NGN")}
        </span>
      ),
      cellClassName: "hidden lg:table-cell w-28 text-right",
      headerClassName: "hidden lg:table-cell text-right",
    },
    {
      id: "status",
      header: "Status",
      cell: (e) => <EventStatusBadge status={e.status} />,
      cellClassName: "w-28",
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      keyExtractor={(e) => e.id}
      isLoading={isLoading}
      isFetching={isFetching}
      page={data?.page}
      lastPage={data?.last_page}
      total={data?.total}
      onPageChange={setPage}
      filters={
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title or slug…"
            className="w-56"
          />
          <ToggleGroup
            type="single"
            size="sm"
            value={status}
            onValueChange={(v) => v && setStatus(v as StatusFilter)}
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="draft">Draft</ToggleGroupItem>
            <ToggleGroupItem value="published">Published</ToggleGroupItem>
            <ToggleGroupItem value="past">Past</ToggleGroupItem>
          </ToggleGroup>
        </div>
      }
      empty={{ title: "No events match." }}
      onRowClick={(e) => router.push(`/admin/events/${e.id}`)}
    />
  )
}
