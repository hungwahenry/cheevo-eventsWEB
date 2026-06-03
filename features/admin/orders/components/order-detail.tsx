"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ReasonDialog } from "@/features/admin/components/reason-dialog"
import { OrderStatusBadge } from "@/features/admin/orders/components/order-status-badge"
import { RefundDialog } from "@/features/admin/orders/components/refund-dialog"
import {
  useCancelOrder,
  useMarkOrderPaid,
  useOrder,
  useRefundOrder,
} from "@/features/admin/orders/hooks"
import { formatMoney } from "@/lib/format/money"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function OrderDetail({ id }: { id: string }) {
  const { data: order, isLoading } = useOrder(id)
  const refund = useRefundOrder()
  const cancel = useCancelOrder()
  const markPaid = useMarkOrderPaid()
  const [refundOpen, setRefundOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [payOpen, setPayOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }
  if (!order) {
    return <div className="p-6 text-sm">Order not found.</div>
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <Link
        href="/admin/orders"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ChevronLeftIcon className="size-4" /> Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {formatMoney(order.total_minor, order.currency)}
          </h1>
          <p className="text-muted-foreground text-sm">
            {order.event?.title ?? "—"} · {order.items_quantity_total}{" "}
            ticket{order.items_quantity_total === 1 ? "" : "s"}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Items</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {(order.items ?? []).map((i) => (
                <div
                  key={i.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div className="grid gap-0.5">
                    <span className="text-sm font-medium">{i.ticket_name}</span>
                    <span className="text-muted-foreground text-xs">
                      {i.quantity} × {formatMoney(i.unit_price_minor, order.currency)}
                    </span>
                  </div>
                  <span className="tabular-nums text-sm">
                    {formatMoney(i.subtotal_minor, order.currency)}
                  </span>
                </div>
              ))}
              <div className="mt-2 grid gap-1 text-sm">
                <Row label="Subtotal" value={formatMoney(order.subtotal_minor, order.currency)} />
                <Row label="Fees" value={formatMoney(order.fees_minor, order.currency)} />
                <Row
                  label={<span className="font-semibold">Total</span>}
                  value={
                    <span className="font-semibold">
                      {formatMoney(order.total_minor, order.currency)}
                    </span>
                  }
                />
              </div>
            </CardContent>
          </Card>

          {order.payment ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm md:grid-cols-2">
                <Field label="Provider" value={order.payment.provider} />
                <Field label="Status" value={order.payment.status} />
                <Field label="Reference" value={order.payment.reference} mono />
                <Field
                  label="Provider ref"
                  value={order.payment.provider_reference ?? "—"}
                  mono
                />
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {order.status === "paid" ? (
              <Button
                variant="destructive"
                onClick={() => setRefundOpen(true)}
                disabled={refund.isPending}
              >
                Refund…
              </Button>
            ) : null}
            {order.status === "pending" ? (
              <>
                <Button onClick={() => setPayOpen(true)} disabled={markPaid.isPending}>
                  Mark paid…
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCancelOpen(true)}
                  disabled={cancel.isPending}
                >
                  Cancel…
                </Button>
              </>
            ) : null}
            <div className="border-t pt-3 text-xs">
              <div className="text-muted-foreground">Buyer</div>
              <div className="font-medium">
                {order.user?.username
                  ? `@${order.user.username}`
                  : order.user?.email ?? "[deleted]"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <RefundDialog
        open={refundOpen}
        onOpenChange={setRefundOpen}
        amountMinor={order.total_minor}
        currency={order.currency}
        isSubmitting={refund.isPending}
        onConfirm={(input) =>
          refund.mutate(
            { id: order.id, input },
            { onSuccess: () => setRefundOpen(false) }
          )
        }
      />

      <ReasonDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel order?"
        description="Releases ticket holds. Only valid on pending orders."
        confirmLabel="Cancel order"
        destructive
        isSubmitting={cancel.isPending}
        onConfirm={(reason) =>
          cancel.mutate(
            { id: order.id, reason },
            { onSuccess: () => setCancelOpen(false) }
          )
        }
      />

      <ReasonDialog
        open={payOpen}
        onOpenChange={setPayOpen}
        title="Mark order paid?"
        description="Fulfills the order and issues tickets. Use for off-platform settlements (bank transfer, cash)."
        confirmLabel="Mark paid"
        isSubmitting={markPaid.isPending}
        onConfirm={(reason) =>
          markPaid.mutate(
            { id: order.id, reason },
            { onSuccess: () => setPayOpen(false) }
          )
        }
      />
    </div>
  )
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

function Field({
  label,
  value,
  mono,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="grid gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={mono ? "font-mono text-xs" : ""}>{value}</span>
    </div>
  )
}
