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
import { PlatformFormDialog } from "@/features/admin/social-platforms/components/platform-form-dialog"
import {
  useCreateSocialPlatform,
  useDeleteSocialPlatform,
  useSocialPlatforms,
  useUpdateSocialPlatform,
} from "@/features/admin/social-platforms/hooks"
import type { AdminSocialPlatform } from "@/features/admin/social-platforms/types"
import { MoreHorizontalIcon, PlusIcon } from "lucide-react"
import { useState } from "react"

export function PlatformsManager() {
  const { data, isLoading, isFetching } = useSocialPlatforms()
  const create = useCreateSocialPlatform()
  const update = useUpdateSocialPlatform()
  const del = useDeleteSocialPlatform()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AdminSocialPlatform | null>(null)
  const [deleteTarget, setDeleteTarget] =
    useState<AdminSocialPlatform | null>(null)

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }
  const openEdit = (p: AdminSocialPlatform) => {
    setEditing(p)
    setDialogOpen(true)
  }
  const close = () => {
    setDialogOpen(false)
    setEditing(null)
  }

  const columns: DataTableColumn<AdminSocialPlatform>[] = [
    {
      id: "name",
      header: "Platform",
      cell: (p) => (
        <div className="grid gap-0.5">
          <span className="font-medium">{p.name}</span>
          <span className="text-muted-foreground font-mono text-xs">
            {p.slug}
          </span>
        </div>
      ),
    },
    {
      id: "base_url",
      header: "Base URL",
      cell: (p) => (
        <span className="text-muted-foreground font-mono text-xs">
          {p.base_url ?? "—"}
        </span>
      ),
      cellClassName: "hidden md:table-cell",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "sort",
      header: "Sort",
      cell: (p) => (
        <span className="tabular-nums text-xs">{p.sort_order}</span>
      ),
      cellClassName: "hidden lg:table-cell w-16 text-right",
      headerClassName: "hidden lg:table-cell text-right",
    },
    {
      id: "active",
      header: "Active",
      cell: (p) => <ActiveBadge active={p.is_active} />,
      cellClassName: "w-24",
    },
    {
      id: "actions",
      header: "",
      cell: (p) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(p)}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteTarget(p)}
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
        keyExtractor={(p) => String(p.id)}
        isLoading={isLoading}
        isFetching={isFetching}
        filters={
          <Button onClick={openCreate}>
            <PlusIcon className="size-4" /> New platform
          </Button>
        }
        empty={{ title: "No social platforms yet." }}
      />
      <PlatformFormDialog
        open={dialogOpen}
        onOpenChange={(open) => (open ? null : close())}
        platform={editing}
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
        description="Org links to this platform will be removed."
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
