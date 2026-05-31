"use client"

import {
  DataTable,
  type DataTableColumn,
} from "@/components/data-table"
import type {
  Balance,
  EventBalanceRow,
} from "@/features/organizer/payouts/types"
import { formatMoney } from "@/lib/format/money"
import { useRouter } from "next/navigation"

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
}

function formatShort(iso: string | null): string | null {
  if (!iso) return null
  return new Date(iso).toLocaleString(undefined, DATE_OPTS)
}

type Props = {
  balance?: Balance
  isLoading?: boolean
}

export function PerEventBalanceTable({ balance, isLoading }: Props) {
  const router = useRouter()
  const currency = balance?.currency ?? "NGN"

  const columns: DataTableColumn<EventBalanceRow>[] = [
    {
      id: "event",
      header: "Event",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{row.title}</p>
          <p className="text-muted-foreground truncate text-xs">
            {formatShort(row.ends_at) ?? "TBD"}
          </p>
        </div>
      ),
    },
    {
      id: "revenue",
      header: "Revenue",
      cell: (row) => (
        <span className="tabular-nums">
          {formatMoney(row.revenue_minor, currency)}
        </span>
      ),
      headerClassName: "text-right",
      cellClassName: "text-right",
    },
  ]

  return (
    <DataTable<EventBalanceRow>
      columns={columns}
      data={balance?.per_event ?? []}
      keyExtractor={(row) => row.event_id}
      isLoading={isLoading}
      empty={{
        title: "No revenue yet",
        description:
          "Per-event revenue from paid orders will show up here as it comes in.",
      }}
      onRowClick={(row) => router.push(`/organizer/events/${row.event_id}`)}
    />
  )
}
