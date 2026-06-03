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
import { CategoryFormDialog } from "@/features/admin/organisation-categories/components/category-form-dialog"
import {
  useCreateOrganisationCategory,
  useDeleteOrganisationCategory,
  useOrganisationCategories,
  useUpdateOrganisationCategory,
} from "@/features/admin/organisation-categories/hooks"
import type { AdminOrganisationCategory } from "@/features/admin/organisation-categories/types"
import { MoreHorizontalIcon, PlusIcon } from "lucide-react"
import { useState } from "react"

export function CategoriesManager() {
  const { data, isLoading, isFetching } = useOrganisationCategories()
  const create = useCreateOrganisationCategory()
  const update = useUpdateOrganisationCategory()
  const del = useDeleteOrganisationCategory()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AdminOrganisationCategory | null>(null)
  const [deleteTarget, setDeleteTarget] =
    useState<AdminOrganisationCategory | null>(null)

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }
  const openEdit = (cat: AdminOrganisationCategory) => {
    setEditing(cat)
    setDialogOpen(true)
  }
  const close = () => {
    setDialogOpen(false)
    setEditing(null)
  }

  const columns: DataTableColumn<AdminOrganisationCategory>[] = [
    {
      id: "name",
      header: "Category",
      cell: (c) => (
        <div className="grid gap-0.5">
          <span className="font-medium">{c.name}</span>
          <span className="text-muted-foreground font-mono text-xs">
            {c.slug}
          </span>
        </div>
      ),
    },
    {
      id: "usage",
      header: "Usage",
      cell: (c) => (
        <span className="text-muted-foreground text-xs">
          {c.usage ? `${c.usage.organisations} orgs` : "—"}
        </span>
      ),
      cellClassName: "hidden md:table-cell w-32",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "sort",
      header: "Sort",
      cell: (c) => (
        <span className="tabular-nums text-xs">{c.sort_order}</span>
      ),
      cellClassName: "hidden lg:table-cell w-16 text-right",
      headerClassName: "hidden lg:table-cell text-right",
    },
    {
      id: "active",
      header: "Active",
      cell: (c) => <ActiveBadge active={c.is_active} />,
      cellClassName: "w-24",
    },
    {
      id: "actions",
      header: "",
      cell: (c) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(c)}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteTarget(c)}
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
        keyExtractor={(c) => String(c.id)}
        isLoading={isLoading}
        isFetching={isFetching}
        filters={
          <Button onClick={openCreate}>
            <PlusIcon className="size-4" /> New category
          </Button>
        }
        empty={{ title: "No categories yet." }}
      />
      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={(open) => (open ? null : close())}
        category={editing}
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
        description="Organisations using this category will be uncategorised."
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
