"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { OrderStatusBadge } from "@/features/organizer/events/sales/components/order-status-badge"
import { useEventOrders } from "@/features/organizer/events/sales/hooks"
import type {
  EventOrder,
  OrderStatus,
} from "@/features/organizer/events/sales/types"
import { formatRelativeShort } from "@/lib/format/datetime"
import { formatMoney } from "@/lib/format/money"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type StatusFilter = OrderStatus | "all"

export function OrdersList({ eventId }: { eventId: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<StatusFilter>("all")
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [status])

  const { data, isLoading, isFetching } = useEventOrders(
    eventId,
    page,
    status === "all" ? undefined : status
  )

  const columns: DataTableColumn<EventOrder>[] = [
    {
      id: "buyer",
      header: "Buyer",
      cell: (o) => <BuyerCell order={o} />,
    },
    {
      id: "tickets",
      header: "Tickets",
      cell: (o) => (
        <span className="text-sm">
          {o.items_count} ticket{o.items_count === 1 ? "" : "s"}
        </span>
      ),
    },
    {
      id: "total",
      header: "Total",
      cell: (o) => (
        <span className="font-semibold tabular-nums">
          {formatMoney(o.total_minor, o.currency)}
        </span>
      ),
      cellClassName: "text-right",
      headerClassName: "text-right",
    },
    {
      id: "status",
      header: "Status",
      cell: (o) => <OrderStatusBadge status={o.status} />,
    },
    {
      id: "placed",
      header: "Placed",
      cell: (o) => (
        <span className="text-muted-foreground text-xs">
          {formatRelativeShort(o.paid_at ?? o.created_at)}
        </span>
      ),
    },
  ]

  return (
    <DataTable<EventOrder>
      columns={columns}
      data={data?.items ?? []}
      keyExtractor={(o) => o.id}
      isLoading={isLoading}
      isFetching={isFetching}
      page={data?.page ?? page}
      lastPage={data?.last_page ?? 1}
      total={data?.total}
      onPageChange={setPage}
      filters={
        <ToggleGroup
          type="single"
          value={status}
          onValueChange={(v) => v && setStatus(v as StatusFilter)}
          variant="outline"
          size="sm">
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="paid">Paid</ToggleGroupItem>
          <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
          <ToggleGroupItem value="cancelled">Cancelled</ToggleGroupItem>
          <ToggleGroupItem value="refunded">Refunded</ToggleGroupItem>
        </ToggleGroup>
      }
      empty={{
        title: "No orders yet",
        description: "Once people buy tickets, they'll show up here.",
      }}
      onRowClick={(o) =>
        router.push(`/organizer/events/${eventId}/orders/${o.id}`)
      }
    />
  )
}

function BuyerCell({ order }: { order: EventOrder }) {
  const name =
    order.buyer.display_name ?? order.buyer.username ?? order.buyer.email ?? "—"
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="flex items-center gap-2.5">
      <Avatar size="sm">
        {order.buyer.avatar_url ? (
          <AvatarImage src={order.buyer.avatar_url} alt="" />
        ) : null}
        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{name}</p>
        {order.buyer.email && order.buyer.email !== name ? (
          <p className="truncate text-xs text-muted-foreground">
            {order.buyer.email}
          </p>
        ) : null}
      </div>
    </div>
  )
}
