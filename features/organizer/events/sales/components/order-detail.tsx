"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { OrderStatusBadge } from "@/features/organizer/events/sales/components/order-status-badge"
import { useEventOrder } from "@/features/organizer/events/sales/hooks"
import { formatMoney } from "@/lib/format/money"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export function OrderDetail({
  eventId,
  orderId,
}: {
  eventId: string
  orderId: string
}) {
  const { data: order, isLoading } = useEventOrder(eventId, orderId)

  if (isLoading || !order) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
  }

  const buyerName =
    order.buyer.display_name ?? order.buyer.username ?? order.buyer.email ?? "—"
  const initials = buyerName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/organizer/events/${eventId}`}
        className="inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Back to event
      </Link>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Order #{order.id.slice(-8)}</h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          Placed{" "}
          {new Date(order.created_at).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      </div>

      <section className="rounded-xl border p-5">
        <h2 className="mb-4 text-sm font-semibold">Buyer</h2>
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            {order.buyer.avatar_url ? (
              <AvatarImage src={order.buyer.avatar_url} alt="" />
            ) : null}
            <AvatarFallback className="text-sm">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{buyerName}</p>
            {order.buyer.email ? (
              <p className="truncate text-xs text-muted-foreground">
                {order.buyer.email}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-xl border">
        <header className="border-b px-5 py-3">
          <h2 className="text-sm font-semibold">Items</h2>
        </header>
        <ul className="divide-y">
          {order.items?.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between px-5 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{item.ticket_name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} ×{" "}
                  {formatMoney(item.unit_price_minor, order.currency)}
                </p>
              </div>
              <span className="font-semibold tabular-nums">
                {formatMoney(item.subtotal_minor, order.currency)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border p-5">
        <h2 className="mb-4 text-sm font-semibold">Totals</h2>
        <dl className="flex flex-col gap-2 text-sm">
          <Row
            label="Subtotal"
            value={formatMoney(order.subtotal_minor, order.currency)}
          />
          <Row
            label="Fees"
            value={formatMoney(order.fees_minor, order.currency)}
            muted
          />
          <Row
            label="Buyer paid"
            value={formatMoney(order.total_minor, order.currency)}
            bold
          />
        </dl>
      </section>
    </div>
  )
}

function Row({
  label,
  value,
  muted,
  bold,
}: {
  label: string
  value: string
  muted?: boolean
  bold?: boolean
}) {
  return (
    <div
      className={`flex justify-between ${muted ? "text-muted-foreground" : ""} ${bold ? "border-t pt-2 font-semibold" : ""}`}
    >
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}
