"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { PayoutStatusBadge } from "@/features/admin/payouts/components/payout-status-badge"
import { usePayouts } from "@/features/admin/payouts/hooks"
import type {
  AdminPayout,
  AdminPayoutStatus,
} from "@/features/admin/payouts/types"
import { formatMoney } from "@/lib/format/money"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type StatusFilter = AdminPayoutStatus | "all"

export function PayoutsTable() {
  const router = useRouter()
  const [status, setStatus] = useState<StatusFilter>("requested")
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [status])

  const { data, isLoading, isFetching } = usePayouts({
    status: status === "all" ? undefined : status,
    page,
  })

  const columns: DataTableColumn<AdminPayout>[] = [
    {
      id: "org",
      header: "Organisation",
      cell: (p) => (
        <div className="grid gap-0.5">
          <span className="font-medium">{p.organisation?.name ?? "—"}</span>
          {p.bank_name ? (
            <span className="text-muted-foreground text-xs">
              {p.bank_name} · {p.account_number}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      id: "net",
      header: "Net",
      cell: (p) => (
        <span className="tabular-nums">
          {formatMoney(p.net_minor, p.currency)}
        </span>
      ),
      cellClassName: "w-32 text-right",
      headerClassName: "text-right",
    },
    {
      id: "fees",
      header: "Fees",
      cell: (p) => (
        <span className="tabular-nums text-xs">
          {formatMoney(p.fees_minor, p.currency)}
        </span>
      ),
      cellClassName: "w-28 text-right hidden lg:table-cell",
      headerClassName: "hidden lg:table-cell text-right",
    },
    {
      id: "requested",
      header: "Requested",
      cell: (p) => (
        <span className="text-muted-foreground text-xs">
          {p.requested_at
            ? new Date(p.requested_at).toLocaleDateString()
            : "—"}
        </span>
      ),
      cellClassName: "w-28 hidden md:table-cell",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "status",
      header: "Status",
      cell: (p) => <PayoutStatusBadge status={p.status} />,
      cellClassName: "w-32",
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
        <ToggleGroup
          type="single"
          size="sm"
          value={status}
          onValueChange={(v) => v && setStatus(v as StatusFilter)}
        >
          <ToggleGroupItem value="requested">Requested</ToggleGroupItem>
          <ToggleGroupItem value="processing">Processing</ToggleGroupItem>
          <ToggleGroupItem value="paid">Paid</ToggleGroupItem>
          <ToggleGroupItem value="failed">Failed</ToggleGroupItem>
          <ToggleGroupItem value="rejected">Rejected</ToggleGroupItem>
          <ToggleGroupItem value="all">All</ToggleGroupItem>
        </ToggleGroup>
      }
      empty={{ title: "No payouts in this state." }}
      onRowClick={(p) => router.push(`/admin/payouts/${p.id}`)}
    />
  )
}
