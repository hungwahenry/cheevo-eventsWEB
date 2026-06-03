"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BroadcastStatusBadge } from "@/features/admin/broadcasts/components/broadcast-status-badge"
import { useBroadcasts } from "@/features/admin/broadcasts/hooks"
import type {
  AdminBroadcast,
  AdminBroadcastStatus,
} from "@/features/admin/broadcasts/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type StatusFilter = AdminBroadcastStatus | "all"

export function BroadcastsTable() {
  const router = useRouter()
  const [status, setStatus] = useState<StatusFilter>("all")
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [status])

  const { data, isLoading, isFetching } = useBroadcasts({
    status: status === "all" ? undefined : status,
    page,
  })

  const columns: DataTableColumn<AdminBroadcast>[] = [
    {
      id: "subject",
      header: "Subject",
      cell: (b) => (
        <div className="grid gap-0.5">
          <span className="line-clamp-1 font-medium">{b.subject}</span>
          {b.organisation ? (
            <span className="text-muted-foreground text-xs">
              {b.organisation.name}
              {b.event ? ` · ${b.event.title}` : ""}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      id: "recipients",
      header: "Recipients",
      cell: (b) => (
        <span className="tabular-nums text-xs">{b.recipients_count}</span>
      ),
      cellClassName: "hidden md:table-cell w-24 text-right",
      headerClassName: "hidden md:table-cell text-right",
    },
    {
      id: "delivery",
      header: "Delivered",
      cell: (b) => (
        <span className="tabular-nums text-xs">
          {b.sent_count} / {b.recipients_count}
          {b.failed_count > 0 ? (
            <span className="text-destructive ml-1">({b.failed_count} ✗)</span>
          ) : null}
        </span>
      ),
      cellClassName: "hidden lg:table-cell w-32 text-right",
      headerClassName: "hidden lg:table-cell text-right",
    },
    {
      id: "created",
      header: "Created",
      cell: (b) => (
        <span className="text-muted-foreground text-xs">
          {b.created_at ? new Date(b.created_at).toLocaleDateString() : "—"}
        </span>
      ),
      cellClassName: "hidden md:table-cell w-28",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "status",
      header: "Status",
      cell: (b) => <BroadcastStatusBadge status={b.status} />,
      cellClassName: "w-28",
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      keyExtractor={(b) => b.id}
      isLoading={isLoading}
      isFetching={isFetching}
      page={data?.page}
      lastPage={data?.last_page}
      total={data?.total}
      onPageChange={setPage}
      filters={
        <ToggleGroup
          type="single"
          size="sm"
          value={status}
          onValueChange={(v) => v && setStatus(v as StatusFilter)}
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="queued">Queued</ToggleGroupItem>
          <ToggleGroupItem value="sending">Sending</ToggleGroupItem>
          <ToggleGroupItem value="sent">Sent</ToggleGroupItem>
          <ToggleGroupItem value="failed">Failed</ToggleGroupItem>
          <ToggleGroupItem value="cancelled">Cancelled</ToggleGroupItem>
        </ToggleGroup>
      }
      empty={{ title: "No broadcasts." }}
      onRowClick={(b) => router.push(`/admin/broadcasts/${b.id}`)}
    />
  )
}
