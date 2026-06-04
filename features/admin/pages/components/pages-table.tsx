"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { NewPageDialog } from "@/features/admin/pages/components/new-page-dialog"
import { PageStatusBadge } from "@/features/admin/pages/components/page-status-badge"
import { usePages } from "@/features/admin/pages/hooks"
import type { AdminPage } from "@/features/admin/pages/types"
import { FileTextIcon, PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type PublishedFilter = "all" | "published" | "draft"

const STARTERS = [
  { title: "Terms of Service", description: "Your platform's legal terms." },
  { title: "Privacy Policy", description: "Data handling, NDPR / GDPR." },
  { title: "About", description: "Who you are, what cheevo is." },
] as const

export function PagesTable() {
  const router = useRouter()
  const [filter, setFilter] = useState<PublishedFilter>("all")
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [seedTitle, setSeedTitle] = useState<string>("")

  useEffect(() => {
    setPage(1)
  }, [filter, q])

  const { data, isLoading, isFetching } = usePages({
    published:
      filter === "published" ? true : filter === "draft" ? false : undefined,
    q: q.trim() || undefined,
    page,
  })

  const openNewDialog = (title?: string) => {
    setSeedTitle(title ?? "")
    setDialogOpen(true)
  }

  const isEmpty =
    !isLoading && (data?.items ?? []).length === 0 && filter === "all" && q === ""

  if (isEmpty) {
    return (
      <>
        <Card>
          <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
            <div className="bg-muted flex size-12 items-center justify-center rounded-full">
              <FileTextIcon className="text-muted-foreground size-6" />
            </div>
            <div className="grid gap-1">
              <h3 className="text-base font-semibold">No pages yet</h3>
              <p className="text-muted-foreground text-sm">
                Start with one of the common legal pages, or create a blank one.
              </p>
            </div>
            <div className="grid w-full max-w-md gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s.title}
                  onClick={() => openNewDialog(s.title)}
                  className="hover:bg-muted/60 grid gap-0.5 rounded-md border p-3 text-left transition"
                >
                  <span className="text-sm font-medium">{s.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {s.description}
                  </span>
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={() => openNewDialog()}>
              <PlusIcon className="size-4" /> Blank page
            </Button>
          </CardContent>
        </Card>
        <NewPageDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          defaultTitle={seedTitle || undefined}
        />
      </>
    )
  }

  const columns: DataTableColumn<AdminPage>[] = [
    {
      id: "title",
      header: "Page",
      cell: (p) => (
        <div className="grid gap-0.5">
          <span className="font-medium">{p.title}</span>
          <span className="text-muted-foreground font-mono text-xs">
            /{p.slug}
          </span>
        </div>
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
  ]

  return (
    <>
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
            <Button onClick={() => openNewDialog()}>
              <PlusIcon className="size-4" /> New page
            </Button>
          </div>
        }
        empty={{ title: "No pages match the current filter." }}
        onRowClick={(p) => router.push(`/admin/pages/${p.id}`)}
      />
      <NewPageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultTitle={seedTitle || undefined}
      />
    </>
  )
}
