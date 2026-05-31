"use client"

import {
  DataTable,
  type DataTableColumn,
} from "@/components/data-table"
import { PayoutStatusBadge } from "@/features/organizer/payouts/components/payout-status-badge"
import { usePayouts } from "@/features/organizer/payouts/hooks"
import type { Payout } from "@/features/organizer/payouts/types"
import { formatMoney } from "@/lib/format/money"
import { useState } from "react"

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
}

function formatShort(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleString(undefined, DATE_OPTS)
}

export function PayoutsHistoryTable({ orgId }: { orgId: string }) {
  const [page, setPage] = useState(1)
  const { data, isLoading, isFetching } = usePayouts(orgId, page)

  const columns: DataTableColumn<Payout>[] = [
    {
      id: "requested",
      header: "Requested",
      cell: (p) => (
        <span className="text-sm">{formatShort(p.requested_at)}</span>
      ),
    },
    {
      id: "amount",
      header: "Amount",
      cell: (p) => (
        <span className="font-semibold tabular-nums">
          {formatMoney(p.amount_minor, p.currency)}
        </span>
      ),
      headerClassName: "text-right",
      cellClassName: "text-right",
    },
    {
      id: "net",
      header: "Lands",
      cell: (p) => (
        <span className="text-muted-foreground tabular-nums">
          {formatMoney(p.net_minor, p.currency)}
        </span>
      ),
      headerClassName: "text-right",
      cellClassName: "text-right",
    },
    {
      id: "destination",
      header: "Destination",
      cell: (p) => (
        <div className="text-sm">
          <p className="font-medium">{p.account_name}</p>
          <p className="text-muted-foreground text-xs">
            {p.bank_name} · {p.account_number}
          </p>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (p) => <PayoutStatusBadge status={p.status} />,
    },
  ]

  return (
    <DataTable<Payout>
      columns={columns}
      data={data?.items ?? []}
      keyExtractor={(p) => p.id}
      isLoading={isLoading}
      isFetching={isFetching}
      page={data?.page ?? page}
      lastPage={data?.last_page ?? 1}
      total={data?.total}
      onPageChange={setPage}
      empty={{
        title: "No payouts yet",
        description: "Once you request a payout it'll show up here.",
      }}
    />
  )
}
