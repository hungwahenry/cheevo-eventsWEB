"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/features/organizer/events/sales/components/order-status-badge"
import { useEventOrders } from "@/features/organizer/events/sales/hooks"
import type { EventOrder } from "@/features/organizer/events/sales/types"
import { formatRelativeShort } from "@/lib/format/datetime"
import { formatMoney } from "@/lib/format/money"
import Link from "next/link"
import { useMemo } from "react"

export function OrdersList({ eventId }: { eventId: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useEventOrders(eventId)

  const items = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  )

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-10 text-center">
        <p className="text-sm font-medium">No orders yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Once people buy tickets, they&apos;ll show up here.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="divide-y rounded-xl border">
        {items.map((order) => (
          <OrderRow key={order.id} eventId={eventId} order={order} />
        ))}
      </ul>

      {hasNextPage ? (
        <Button
          variant="outline"
          size="sm"
          className="self-center"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </Button>
      ) : null}
    </div>
  )
}

function OrderRow({
  eventId,
  order,
}: {
  eventId: string
  order: EventOrder
}) {
  const buyerName =
    order.buyer.display_name ?? order.buyer.username ?? order.buyer.email ?? "—"
  const initials = buyerName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const when = formatRelativeShort(order.paid_at ?? order.created_at)

  return (
    <li>
      <Link
        href={`/organizer/events/${eventId}/orders/${order.id}`}
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
      >
        <Avatar className="size-9">
          {order.buyer.avatar_url ? (
            <AvatarImage src={order.buyer.avatar_url} alt="" />
          ) : null}
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{buyerName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {order.items_count} ticket{order.items_count === 1 ? "" : "s"} ·{" "}
            {when ?? "—"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-semibold tabular-nums">
            {formatMoney(order.total_minor, order.currency)}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
      </Link>
    </li>
  )
}
