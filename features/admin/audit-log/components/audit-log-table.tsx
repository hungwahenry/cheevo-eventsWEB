"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAuditLog } from "@/features/admin/audit-log/hooks"
import type { AdminAuditEntry } from "@/features/admin/audit-log/types"
import { EyeIcon } from "lucide-react"
import { useEffect, useState } from "react"

export function AuditLogTable() {
  const [q, setQ] = useState("")
  const [action, setAction] = useState("")
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<AdminAuditEntry | null>(null)

  useEffect(() => {
    setPage(1)
  }, [q, action])

  const { data, isLoading, isFetching } = useAuditLog({
    q: q.trim() || undefined,
    action: action.trim() || undefined,
    page,
  })

  const columns: DataTableColumn<AdminAuditEntry>[] = [
    {
      id: "when",
      header: "When",
      cell: (e) => (
        <span className="text-muted-foreground text-xs">
          {e.created_at ? new Date(e.created_at).toLocaleString() : "—"}
        </span>
      ),
      cellClassName: "w-44",
    },
    {
      id: "admin",
      header: "Admin",
      cell: (e) =>
        e.admin ? (
          <span className="text-xs">
            {e.admin.username ? `@${e.admin.username}` : e.admin.email}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">[deleted]</span>
        ),
      cellClassName: "hidden md:table-cell w-44",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "action",
      header: "Action",
      cell: (e) => (
        <Badge variant="outline" className="font-mono text-xs">
          {e.action}
        </Badge>
      ),
    },
    {
      id: "target",
      header: "Target",
      cell: (e) =>
        e.target_type ? (
          <span className="text-muted-foreground font-mono text-xs">
            {e.target_type}:{e.target_id?.slice(-10) ?? "—"}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
      cellClassName: "hidden lg:table-cell",
      headerClassName: "hidden lg:table-cell",
    },
    {
      id: "reason",
      header: "Reason",
      cell: (e) => (
        <span className="text-muted-foreground line-clamp-1 text-xs">
          {e.reason ?? "—"}
        </span>
      ),
      cellClassName: "hidden lg:table-cell",
      headerClassName: "hidden lg:table-cell",
    },
    {
      id: "view",
      header: "",
      cell: (e) => (
        <Button size="icon" variant="ghost" onClick={() => setViewing(e)}>
          <EyeIcon className="size-4" />
        </Button>
      ),
      cellClassName: "w-12 text-right",
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        keyExtractor={(e) => e.id}
        isLoading={isLoading}
        isFetching={isFetching}
        page={data?.page}
        lastPage={data?.last_page}
        total={data?.total}
        onPageChange={setPage}
        filters={
          <div className="flex flex-wrap gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search action or reason…"
              className="w-56"
            />
            <Input
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Exact action (e.g. orders.refund)"
              className="w-64 font-mono text-xs"
            />
          </div>
        }
        empty={{ title: "No audit entries match." }}
      />

      <Dialog
        open={Boolean(viewing)}
        onOpenChange={(open) => {
          if (!open) setViewing(null)
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-base">
              {viewing?.action}
            </DialogTitle>
          </DialogHeader>
          {viewing ? (
            <div className="grid gap-3 text-sm">
              <Detail label="When" value={viewing.created_at ?? "—"} />
              <Detail
                label="Admin"
                value={viewing.admin?.email ?? "[deleted]"}
              />
              <Detail
                label="Target"
                value={
                  viewing.target_type
                    ? `${viewing.target_type}:${viewing.target_id}`
                    : "—"
                }
                mono
              />
              {viewing.reason ? (
                <Detail label="Reason" value={viewing.reason} />
              ) : null}
              <Detail label="IP" value={viewing.ip ?? "—"} mono />
              {viewing.request_id ? (
                <Detail label="Request ID" value={viewing.request_id} mono />
              ) : null}
              {viewing.payload ? (
                <div className="grid gap-1">
                  <span className="text-muted-foreground text-xs">Payload</span>
                  <pre className="bg-muted overflow-x-auto rounded-md p-3 font-mono text-xs">
                    {JSON.stringify(viewing.payload, null, 2)}
                  </pre>
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

function Detail({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="grid gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={mono ? "font-mono text-xs" : ""}>{value}</span>
    </div>
  )
}
