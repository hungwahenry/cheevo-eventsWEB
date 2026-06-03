"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ReasonDialog } from "@/features/admin/components/reason-dialog"
import { IssuedTicketStatusBadge } from "@/features/admin/issued-tickets/components/issued-ticket-status-badge"
import { TransferTicketDialog } from "@/features/admin/issued-tickets/components/transfer-ticket-dialog"
import {
  useIssuedTickets,
  useReissueIssuedTicket,
  useRevokeIssuedTicket,
  useTransferIssuedTicket,
} from "@/features/admin/issued-tickets/hooks"
import type {
  AdminIssuedTicket,
  AdminIssuedTicketStatus,
} from "@/features/admin/issued-tickets/types"
import { MoreHorizontalIcon } from "lucide-react"
import { useEffect, useState } from "react"

type StatusFilter = AdminIssuedTicketStatus | "all"

export function IssuedTicketsTable() {
  const [status, setStatus] = useState<StatusFilter>("all")
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [revokeTarget, setRevokeTarget] = useState<AdminIssuedTicket | null>(
    null
  )
  const [transferTarget, setTransferTarget] =
    useState<AdminIssuedTicket | null>(null)
  const revoke = useRevokeIssuedTicket()
  const reissue = useReissueIssuedTicket()
  const transfer = useTransferIssuedTicket()

  useEffect(() => {
    setPage(1)
  }, [status, q])

  const { data, isLoading, isFetching } = useIssuedTickets({
    status: status === "all" ? undefined : status,
    q: q.trim() || undefined,
    page,
  })

  const columns: DataTableColumn<AdminIssuedTicket>[] = [
    {
      id: "code",
      header: "Code",
      cell: (t) => <span className="font-mono text-xs">{t.code}</span>,
    },
    {
      id: "event",
      header: "Event",
      cell: (t) => (
        <div className="grid gap-0.5">
          <span className="line-clamp-1 text-xs">
            {t.event?.title ?? "—"}
          </span>
          <span className="text-muted-foreground text-xs">
            {t.ticket?.name ?? ""}
          </span>
        </div>
      ),
      cellClassName: "hidden md:table-cell",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "holder",
      header: "Holder",
      cell: (t) =>
        t.holder ? (
          <span className="text-xs">
            {t.holder.username ? `@${t.holder.username}` : t.holder.email}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">[deleted]</span>
        ),
      cellClassName: "hidden lg:table-cell",
      headerClassName: "hidden lg:table-cell",
    },
    {
      id: "status",
      header: "Status",
      cell: (t) => <IssuedTicketStatusBadge status={t.status} />,
      cellClassName: "w-28",
    },
    {
      id: "actions",
      header: "",
      cell: (t) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {t.status === "valid" ? (
              <>
                <DropdownMenuItem onClick={() => setRevokeTarget(t)}>
                  Revoke…
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTransferTarget(t)}>
                  Transfer…
                </DropdownMenuItem>
              </>
            ) : null}
            {t.status === "revoked" ? (
              <DropdownMenuItem onClick={() => reissue.mutate(t.id)}>
                Reissue
              </DropdownMenuItem>
            ) : null}
            {t.status === "scanned" ? (
              <DropdownMenuItem disabled>No actions</DropdownMenuItem>
            ) : null}
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
        data={data?.items ?? []}
        keyExtractor={(t) => t.id}
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
              placeholder="Search by code…"
              className="w-56"
            />
            <ToggleGroup
              type="single"
              size="sm"
              value={status}
              onValueChange={(v) => v && setStatus(v as StatusFilter)}
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="valid">Valid</ToggleGroupItem>
              <ToggleGroupItem value="scanned">Scanned</ToggleGroupItem>
              <ToggleGroupItem value="revoked">Revoked</ToggleGroupItem>
            </ToggleGroup>
          </div>
        }
        empty={{ title: "No tickets match." }}
      />

      <ReasonDialog
        open={Boolean(revokeTarget)}
        onOpenChange={(open) => {
          if (!open) setRevokeTarget(null)
        }}
        title="Revoke ticket?"
        description="Revoked tickets can't be scanned. The holder will be notified by the organiser if needed."
        confirmLabel="Revoke"
        destructive
        isSubmitting={revoke.isPending}
        onConfirm={(reason) => {
          if (!revokeTarget) return
          revoke.mutate(
            { id: revokeTarget.id, reason },
            { onSuccess: () => setRevokeTarget(null) }
          )
        }}
      />

      <TransferTicketDialog
        open={Boolean(transferTarget)}
        onOpenChange={(open) => {
          if (!open) setTransferTarget(null)
        }}
        isSubmitting={transfer.isPending}
        onConfirm={(toUserId, reason) => {
          if (!transferTarget) return
          transfer.mutate(
            { id: transferTarget.id, toUserId, reason },
            { onSuccess: () => setTransferTarget(null) }
          )
        }}
      />
    </>
  )
}
