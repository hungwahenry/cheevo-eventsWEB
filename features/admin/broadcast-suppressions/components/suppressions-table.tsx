"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  useDeleteSuppression,
  useSuppressions,
} from "@/features/admin/broadcast-suppressions/hooks"
import type {
  AdminBroadcastSuppression,
  AdminSuppressionReason,
} from "@/features/admin/broadcast-suppressions/types"
import { useEffect, useState } from "react"

type ReasonFilter = AdminSuppressionReason | "all"

const REASON_VARIANT: Record<
  AdminSuppressionReason,
  "secondary" | "outline" | "destructive"
> = {
  unsubscribed: "secondary",
  bounced: "destructive",
  complained: "destructive",
}

export function SuppressionsTable() {
  const [reason, setReason] = useState<ReasonFilter>("all")
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const del = useDeleteSuppression()

  useEffect(() => {
    setPage(1)
  }, [reason, q])

  const { data, isLoading, isFetching } = useSuppressions({
    reason: reason === "all" ? undefined : reason,
    q: q.trim() || undefined,
    page,
  })

  const columns: DataTableColumn<AdminBroadcastSuppression>[] = [
    {
      id: "email",
      header: "Email",
      cell: (s) => <span className="font-mono text-xs">{s.email}</span>,
    },
    {
      id: "scope",
      header: "Scope",
      cell: (s) => (
        <span className="text-xs">
          {s.organisation ? s.organisation.name : "Global"}
        </span>
      ),
      cellClassName: "hidden md:table-cell",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "reason",
      header: "Reason",
      cell: (s) => (
        <Badge variant={REASON_VARIANT[s.reason]}>{s.reason}</Badge>
      ),
      cellClassName: "w-32",
    },
    {
      id: "created",
      header: "Created",
      cell: (s) => (
        <span className="text-muted-foreground text-xs">
          {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
        </span>
      ),
      cellClassName: "hidden lg:table-cell w-28",
      headerClassName: "hidden lg:table-cell",
    },
    {
      id: "actions",
      header: "",
      cell: (s) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => del.mutate(s.id)}
          disabled={del.isPending}
        >
          Remove
        </Button>
      ),
      cellClassName: "w-24 text-right",
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      keyExtractor={(s) => s.id}
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
            placeholder="Search email…"
            className="w-56"
          />
          <ToggleGroup
            type="single"
            size="sm"
            value={reason}
            onValueChange={(v) => v && setReason(v as ReasonFilter)}
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="unsubscribed">Unsubscribed</ToggleGroupItem>
            <ToggleGroupItem value="bounced">Bounced</ToggleGroupItem>
            <ToggleGroupItem value="complained">Complained</ToggleGroupItem>
          </ToggleGroup>
        </div>
      }
      empty={{ title: "No suppressions." }}
    />
  )
}
