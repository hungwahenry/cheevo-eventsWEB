"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ReasonDialog } from "@/features/admin/components/reason-dialog"
import {
  useComments,
  useDeleteComment,
  useDismissCommentFlags,
} from "@/features/admin/comments/hooks"
import type { AdminComment } from "@/features/admin/comments/types"
import { FlagIcon, TrashIcon } from "lucide-react"
import { useEffect, useState } from "react"

type FlaggedFilter = "any" | "yes"

export function CommentsTable() {
  const [flagged, setFlagged] = useState<FlaggedFilter>("any")
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<AdminComment | null>(null)

  const removeMutation = useDeleteComment()
  const dismissFlags = useDismissCommentFlags()

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 250)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
  }, [flagged, search])

  const { data, isLoading, isFetching } = useComments({
    q: search || undefined,
    flagged: flagged === "yes" || undefined,
    page,
  })

  const columns: DataTableColumn<AdminComment>[] = [
    {
      id: "comment",
      header: "Comment",
      cell: (c) => (
        <div className="grid gap-0.5">
          <span className="line-clamp-2 text-sm">{c.body ?? "(no text)"}</span>
          {c.event ? (
            <span className="text-muted-foreground text-xs">
              on {c.event.title}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      id: "author",
      header: "Author",
      cell: (c) =>
        c.author ? (
          <span className="text-xs">
            {c.author.username ? `@${c.author.username}` : c.author.email}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
      cellClassName: "hidden md:table-cell w-44",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "engagement",
      header: "Engagement",
      cell: (c) => (
        <div className="text-muted-foreground flex items-center gap-3 text-xs tabular-nums">
          <span>{c.likes_count} ♥</span>
          <span>{c.replies_count} ↩</span>
          {c.flags_count > 0 ? (
            <Badge variant="destructive" className="gap-1">
              <FlagIcon className="size-3" />
              {c.flags_count}
            </Badge>
          ) : null}
        </div>
      ),
      cellClassName: "hidden lg:table-cell w-44",
      headerClassName: "hidden lg:table-cell",
    },
    {
      id: "created",
      header: "Created",
      cell: (c) => (
        <span className="text-muted-foreground text-xs">
          {c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}
        </span>
      ),
      cellClassName: "w-28",
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      cell: (c) => (
        <div className="flex items-center gap-1">
          {c.flags_count > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                dismissFlags.mutate(c.id)
              }}
              disabled={dismissFlags.isPending}
            >
              Clear flags
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              setDeleteTarget(c)
            }}
            aria-label="Delete comment"
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
      ),
      cellClassName: "w-32",
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        keyExtractor={(c) => c.id}
        isLoading={isLoading}
        isFetching={isFetching}
        page={data?.page}
        lastPage={data?.last_page}
        total={data?.total}
        onPageChange={setPage}
        search={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search comment body…"
        filters={
          <ToggleGroup
            type="single"
            size="sm"
            value={flagged}
            onValueChange={(v) => v && setFlagged(v as FlaggedFilter)}
          >
            <ToggleGroupItem value="any">All</ToggleGroupItem>
            <ToggleGroupItem value="yes">Flagged</ToggleGroupItem>
          </ToggleGroup>
        }
        empty={{ title: "No comments match." }}
      />

      <ReasonDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete comment?"
        description="Hard-deletes the comment and cascades any direct replies."
        confirmLabel="Delete"
        destructive
        isSubmitting={removeMutation.isPending}
        onConfirm={(reason) => {
          if (!deleteTarget) return
          removeMutation.mutate(
            { id: deleteTarget.id, reason },
            { onSuccess: () => setDeleteTarget(null) }
          )
        }}
      />
    </>
  )
}
