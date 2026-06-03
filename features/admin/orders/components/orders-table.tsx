"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { OrderStatusBadge } from "@/features/admin/orders/components/order-status-badge"
import { useOrders } from "@/features/admin/orders/hooks"
import type {
  AdminOrder,
  AdminOrderStatus,
} from "@/features/admin/orders/types"
import { formatMoney } from "@/lib/format/money"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type StatusFilter = AdminOrderStatus | "all"

export function OrdersTable() {
  const router = useRouter()
  const [status, setStatus] = useState<StatusFilter>("all")
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [status])

  const { data, isLoading, isFetching } = useOrders({
    status: status === "all" ? undefined : status,
    page,
  })

  const columns: DataTableColumn<AdminOrder>[] = [
    {
      id: "order",
      header: "Order",
      cell: (o) => (
        <div className="grid gap-0.5">
          <span className="font-mono text-xs">{o.id.slice(-12)}</span>
          {o.event ? (
            <span className="text-muted-foreground line-clamp-1 text-xs">
              {o.event.title}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      id: "buyer",
      header: "Buyer",
      cell: (o) =>
        o.user ? (
          <span className="text-xs">
            {o.user.username ? `@${o.user.username}` : o.user.email}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">[deleted]</span>
        ),
      cellClassName: "hidden md:table-cell w-44",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "total",
      header: "Total",
      cell: (o) => (
        <span className="tabular-nums">
          {formatMoney(o.total_minor, o.currency)}
        </span>
      ),
      cellClassName: "w-32 text-right",
      headerClassName: "text-right",
    },
    {
      id: "qty",
      header: "Qty",
      cell: (o) => (
        <span className="tabular-nums text-xs">{o.items_quantity_total}</span>
      ),
      cellClassName: "hidden lg:table-cell w-16 text-right",
      headerClassName: "hidden lg:table-cell text-right",
    },
    {
      id: "created",
      header: "Created",
      cell: (o) => (
        <span className="text-muted-foreground text-xs">
          {o.created_at ? new Date(o.created_at).toLocaleDateString() : "—"}
        </span>
      ),
      cellClassName: "w-28 hidden lg:table-cell",
      headerClassName: "hidden lg:table-cell",
    },
    {
      id: "status",
      header: "Status",
      cell: (o) => <OrderStatusBadge status={o.status} />,
      cellClassName: "w-32",
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      keyExtractor={(o) => o.id}
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
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
          <ToggleGroupItem value="paid">Paid</ToggleGroupItem>
          <ToggleGroupItem value="cancelled">Cancelled</ToggleGroupItem>
          <ToggleGroupItem value="refunded">Refunded</ToggleGroupItem>
        </ToggleGroup>
      }
      empty={{ title: "No orders match." }}
      onRowClick={(o) => router.push(`/admin/orders/${o.id}`)}
    />
  )
}
