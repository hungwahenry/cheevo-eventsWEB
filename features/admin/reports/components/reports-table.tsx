"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ReasonDialog } from "@/features/admin/components/reason-dialog"
import { ReportStatusBadge } from "@/features/admin/reports/components/report-status-badge"
import { relativeFromNow } from "@/features/admin/reports/format"
import {
  useBulkDismissReports,
  useReports,
} from "@/features/admin/reports/hooks"
import type {
  AdminReport,
  AdminReportStatus,
} from "@/features/admin/reports/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type StatusFilter = AdminReportStatus | "all"

export function ReportsTable() {
  const router = useRouter()
  const [status, setStatus] = useState<StatusFilter>("open")
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkOpen, setBulkOpen] = useState(false)

  useEffect(() => {
    setPage(1)
    setSelectedIds(new Set())
  }, [status])

  const { data, isLoading, isFetching } = useReports({
    status: status === "all" ? undefined : status,
    page,
  })
  const bulkDismiss = useBulkDismissReports()

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const items = data?.items ?? []
  const visibleIds = items.map((r) => r.id)
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id))

  const toggleAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allVisibleSelected) {
        visibleIds.forEach((id) => next.delete(id))
      } else {
        visibleIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  const columns: DataTableColumn<AdminReport>[] = [
    {
      id: "select",
      header: (
        <Checkbox
          checked={allVisibleSelected}
          onCheckedChange={toggleAllVisible}
          aria-label="Select all on page"
        />
      ),
      cell: (r) => (
        <Checkbox
          checked={selectedIds.has(r.id)}
          onCheckedChange={() => toggleSelected(r.id)}
          onClick={(e) => e.stopPropagation()}
          aria-label="Select report"
        />
      ),
      cellClassName: "w-10",
    },
    {
      id: "reason",
      header: "Reason",
      cell: (r) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{r.reason?.label ?? "—"}</span>
          {r.details ? (
            <span className="text-muted-foreground line-clamp-1 text-xs">
              {r.details}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      id: "target",
      header: "Target",
      cell: (r) => (
        <span className="text-muted-foreground text-xs">{r.target_type}</span>
      ),
      cellClassName: "w-32 hidden md:table-cell",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "reporter",
      header: "Reporter",
      cell: (r) =>
        r.reporter ? (
          <span className="text-xs">
            {r.reporter.username
              ? `@${r.reporter.username}`
              : r.reporter.email}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
      cellClassName: "w-44 hidden lg:table-cell",
      headerClassName: "hidden lg:table-cell",
    },
    {
      id: "created",
      header: "Created",
      cell: (r) => (
        <span className="text-muted-foreground text-xs">
          {relativeFromNow(r.created_at)}
        </span>
      ),
      cellClassName: "w-28",
    },
    {
      id: "status",
      header: "Status",
      cell: (r) => <ReportStatusBadge status={r.status} />,
      cellClassName: "w-32",
    },
  ]

  const selectedCount = selectedIds.size

  return (
    <>
      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(r) => r.id}
        isLoading={isLoading}
        isFetching={isFetching}
        page={data?.page}
        lastPage={data?.last_page}
        total={data?.total}
        onPageChange={setPage}
        filters={
          <div className="flex items-center gap-3">
            <ToggleGroup
              type="single"
              size="sm"
              value={status}
              onValueChange={(value) => value && setStatus(value as StatusFilter)}
            >
              <ToggleGroupItem value="open">Open</ToggleGroupItem>
              <ToggleGroupItem value="under_review">Reviewing</ToggleGroupItem>
              <ToggleGroupItem value="actioned">Actioned</ToggleGroupItem>
              <ToggleGroupItem value="dismissed">Dismissed</ToggleGroupItem>
              <ToggleGroupItem value="all">All</ToggleGroupItem>
            </ToggleGroup>
            {selectedCount > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkOpen(true)}
              >
                Dismiss {selectedCount}
              </Button>
            ) : null}
          </div>
        }
        empty={{
          title: "No reports here.",
          description: "Reports will appear when attendees flag content.",
        }}
        onRowClick={(r) => router.push(`/admin/reports/${r.id}`)}
      />

      <ReasonDialog
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        title={`Dismiss ${selectedCount} report${selectedCount === 1 ? "" : "s"}`}
        description="Open and under-review reports will be dismissed. Actioned reports are skipped."
        confirmLabel="Dismiss all"
        isSubmitting={bulkDismiss.isPending}
        onConfirm={(reason) => {
          bulkDismiss.mutate(
            { ids: Array.from(selectedIds), resolution_note: reason },
            {
              onSuccess: () => {
                setBulkOpen(false)
                setSelectedIds(new Set())
              },
            }
          )
        }}
      />
    </>
  )
}
