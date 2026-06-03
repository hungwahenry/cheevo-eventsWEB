"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ActiveBadge } from "@/features/admin/components/catalog/active-badge"
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog"
import { InterestFormDialog } from "@/features/admin/interests/components/interest-form-dialog"
import {
  useCreateInterest,
  useDeleteInterest,
  useInterests,
  useUpdateInterest,
} from "@/features/admin/interests/hooks"
import type { AdminInterest } from "@/features/admin/interests/types"
import { MoreHorizontalIcon, PlusIcon } from "lucide-react"
import { useState } from "react"

export function InterestsManager() {
  const { data, isLoading, isFetching } = useInterests()
  const create = useCreateInterest()
  const update = useUpdateInterest()
  const del = useDeleteInterest()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AdminInterest | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminInterest | null>(null)

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }
  const openEdit = (interest: AdminInterest) => {
    setEditing(interest)
    setDialogOpen(true)
  }
  const close = () => {
    setDialogOpen(false)
    setEditing(null)
  }

  const columns: DataTableColumn<AdminInterest>[] = [
    {
      id: "name",
      header: "Interest",
      cell: (i) => (
        <div className="grid gap-0.5">
          <span className="font-medium">{i.name}</span>
          <span className="text-muted-foreground font-mono text-xs">
            {i.slug}
          </span>
        </div>
      ),
    },
    {
      id: "usage",
      header: "Usage",
      cell: (i) => (
        <span className="text-muted-foreground text-xs">
          {i.usage
            ? `${i.usage.events} events · ${i.usage.users} users`
            : "—"}
        </span>
      ),
      cellClassName: "hidden md:table-cell w-40",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "sort",
      header: "Sort",
      cell: (i) => (
        <span className="tabular-nums text-xs">{i.sort_order}</span>
      ),
      cellClassName: "hidden lg:table-cell w-16 text-right",
      headerClassName: "hidden lg:table-cell text-right",
    },
    {
      id: "active",
      header: "Active",
      cell: (i) => <ActiveBadge active={i.is_active} />,
      cellClassName: "w-24",
    },
    {
      id: "actions",
      header: "",
      cell: (i) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(i)}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteTarget(i)}
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
        keyExtractor={(i) => String(i.id)}
        isLoading={isLoading}
        isFetching={isFetching}
        filters={
          <Button onClick={openCreate}>
            <PlusIcon className="size-4" /> New interest
          </Button>
        }
        empty={{ title: "No interests yet." }}
      />
      <InterestFormDialog
        open={dialogOpen}
        onOpenChange={(open) => (open ? null : close())}
        interest={editing}
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
        title={`Delete "${deleteTarget?.name ?? ""}"?`}
        description="Events and users will be detached from this interest."
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
