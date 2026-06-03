"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { OrganisationStatusBadge } from "@/features/admin/organisations/components/organisation-status-badge"
import { useOrganisations } from "@/features/admin/organisations/hooks"
import type { AdminOrganisation } from "@/features/admin/organisations/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type SuspendedFilter = "all" | "active" | "suspended"

export function OrganisationsTable() {
  const router = useRouter()
  const [filter, setFilter] = useState<SuspendedFilter>("all")
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [filter, q])

  const { data, isLoading, isFetching } = useOrganisations({
    suspended:
      filter === "suspended" ? true : filter === "active" ? false : undefined,
    q: q.trim() || undefined,
    page,
  })

  const columns: DataTableColumn<AdminOrganisation>[] = [
    {
      id: "org",
      header: "Organisation",
      cell: (o) => (
        <div className="grid gap-0.5">
          <span className="font-medium">{o.name}</span>
          <span className="text-muted-foreground text-xs">{o.slug}</span>
        </div>
      ),
    },
    {
      id: "city",
      header: "City",
      cell: (o) => (
        <span className="text-xs">{o.city ?? "—"}</span>
      ),
      cellClassName: "hidden md:table-cell w-32",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "events",
      header: "Events",
      cell: (o) => <span className="tabular-nums text-xs">{o.events_count}</span>,
      cellClassName: "hidden lg:table-cell w-20 text-right",
      headerClassName: "hidden lg:table-cell text-right",
    },
    {
      id: "subscribers",
      header: "Subscribers",
      cell: (o) => (
        <span className="tabular-nums text-xs">{o.subscribers_count}</span>
      ),
      cellClassName: "hidden lg:table-cell w-24 text-right",
      headerClassName: "hidden lg:table-cell text-right",
    },
    {
      id: "status",
      header: "Status",
      cell: (o) => <OrganisationStatusBadge organisation={o} />,
      cellClassName: "w-28",
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      keyExtractor={(o) => o.id}
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
            placeholder="Search name or slug…"
            className="w-56"
          />
          <ToggleGroup
            type="single"
            size="sm"
            value={filter}
            onValueChange={(v) => v && setFilter(v as SuspendedFilter)}
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="active">Active</ToggleGroupItem>
            <ToggleGroupItem value="suspended">Suspended</ToggleGroupItem>
          </ToggleGroup>
        </div>
      }
      empty={{ title: "No organisations match." }}
      onRowClick={(o) => router.push(`/admin/organisations/${o.id}`)}
    />
  )
}
