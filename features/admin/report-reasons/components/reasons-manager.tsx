"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ActiveBadge } from "@/features/admin/components/catalog/active-badge"
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog"
import { ReasonFormDialog } from "@/features/admin/report-reasons/components/reason-form-dialog"
import {
  useCreateReportReason,
  useDeleteReportReason,
  useReportReasons,
  useUpdateReportReason,
} from "@/features/admin/report-reasons/hooks"
import type { AdminReportReason } from "@/features/admin/report-reasons/types"
import { MoreHorizontalIcon, PlusIcon } from "lucide-react"
import { useState } from "react"

export function ReasonsManager() {
  const { data, isLoading, isFetching } = useReportReasons()
  const create = useCreateReportReason()
  const update = useUpdateReportReason()
  const del = useDeleteReportReason()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AdminReportReason | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminReportReason | null>(null)

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }
  const openEdit = (r: AdminReportReason) => {
    setEditing(r)
    setDialogOpen(true)
  }
  const close = () => {
    setDialogOpen(false)
    setEditing(null)
  }

  const columns: DataTableColumn<AdminReportReason>[] = [
    {
      id: "label",
      header: "Reason",
      cell: (r) => (
        <div className="grid gap-0.5">
          <span className="font-medium">{r.label}</span>
          <span className="text-muted-foreground font-mono text-xs">
            {r.slug}
          </span>
        </div>
      ),
    },
    {
      id: "scopes",
      header: "Applies to",
      cell: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.scope_types.length === 0 ? (
            <span className="text-muted-foreground text-xs">All</span>
          ) : (
            r.scope_types.map((s) => (
              <Badge key={s} variant="outline" className="text-xs">
                {s}
              </Badge>
            ))
          )}
        </div>
      ),
      cellClassName: "hidden md:table-cell",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "usage",
      header: "Reports",
      cell: (r) => (
        <span className="tabular-nums text-xs">{r.usage?.reports ?? 0}</span>
      ),
      cellClassName: "hidden lg:table-cell w-20 text-right",
      headerClassName: "hidden lg:table-cell text-right",
    },
    {
      id: "active",
      header: "Active",
      cell: (r) => <ActiveBadge active={r.is_active} />,
      cellClassName: "w-24",
    },
    {
      id: "actions",
      header: "",
      cell: (r) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(r)}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteTarget(r)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      cellClassName: "w-12 text-right",
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data ?? []}
        keyExtractor={(r) => r.id}
        isLoading={isLoading}
        isFetching={isFetching}
        filters={
          <Button onClick={openCreate}>
            <PlusIcon className="size-4" /> New reason
          </Button>
        }
        empty={{ title: "No report reasons yet." }}
      />
      <ReasonFormDialog
        open={dialogOpen}
        onOpenChange={(open) => (open ? null : close())}
        reason={editing}
        isSubmitting={create.isPending || update.isPending}
        onSubmit={(payload) => {
          if (editing) {
            update.mutate(
              { id: editing.id, payload },
              { onSuccess: close }
            )
          } else {
            create.mutate(payload, { onSuccess: close })
          }
        }}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title={`Delete "${deleteTarget?.label ?? ""}"?`}
        description="Will fail if any reports reference it — deactivate it instead."
        confirmLabel="Delete"
        destructive
        isSubmitting={del.isPending}
        onConfirm={() => {
          if (!deleteTarget) return
          del.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          })
        }}
      />
    </>
  )
}
