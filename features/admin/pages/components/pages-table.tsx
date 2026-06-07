"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { PageActionsMenu } from "@/features/admin/pages/components/page-actions-menu"
import { PageStatusBadge } from "@/features/admin/pages/components/page-status-badge"
import { usePages } from "@/features/admin/pages/hooks"
import type { AdminPage } from "@/features/admin/pages/types"
import { FileTextIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type PublishedFilter = "all" | "published" | "draft"

export function PagesTable() {
  const [filter, setFilter] = useState<PublishedFilter>("all")
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [filter, q])

  const { data, isLoading, isFetching } = usePages({
    published:
      filter === "published" ? true : filter === "draft" ? false : undefined,
    q: q.trim() || undefined,
    page,
  })

  const isEmpty =
    !isLoading && (data?.items ?? []).length === 0 && filter === "all" && q === ""

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="bg-muted flex size-12 items-center justify-center rounded-full">
            <FileTextIcon className="text-muted-foreground size-6" />
          </div>
          <div className="grid gap-1">
            <h3 className="text-base font-semibold">No pages yet</h3>
            <p className="text-muted-foreground text-sm">
              Create your first static page.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/pages/new">
              <PlusIcon className="size-4" /> New page
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const columns: DataTableColumn<AdminPage>[] = [
    {
      id: "title",
      header: "Page",
      cell: (p) => (
        <Link
          href={`/admin/pages/${p.id}`}
          className="grid gap-0.5 hover:underline"
        >
          <span className="font-medium">{p.title}</span>
          <span className="text-muted-foreground font-mono text-xs">
            /{p.slug}
          </span>
        </Link>
      ),
    },
    {
      id: "updated",
      header: "Updated",
      cell: (p) => (
        <span className="text-muted-foreground text-xs">
          {p.updated_at ? new Date(p.updated_at).toLocaleDateString() : "—"}
        </span>
      ),
      cellClassName: "hidden md:table-cell w-32",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "status",
      header: "Status",
      cell: (p) => <PageStatusBadge published={p.is_published} />,
      cellClassName: "w-28",
    },
    {
      id: "actions",
      header: "",
      cell: (p) => <PageActionsMenu page={p} />,
      cellClassName: "w-12 text-right",
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      keyExtractor={(p) => p.id}
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
            value={filter}
            onValueChange={(v) => v && setFilter(v as PublishedFilter)}
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="published">Published</ToggleGroupItem>
            <ToggleGroupItem value="draft">Draft</ToggleGroupItem>
          </ToggleGroup>
          <Button asChild>
            <Link href="/admin/pages/new">
              <PlusIcon className="size-4" /> New page
            </Link>
          </Button>
        </div>
      }
      empty={{ title: "No pages match the current filter." }}
    />
  )
}
