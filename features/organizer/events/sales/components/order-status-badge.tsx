import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "@/features/organizer/events/sales/types"

const LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  cancelled: "Cancelled",
  refunded: "Refunded",
  failed: "Failed",
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const variant: React.ComponentProps<typeof Badge>["variant"] =
    status === "paid"
      ? "default"
      : status === "pending"
        ? "secondary"
        : "outline"

  return (
    <Badge variant={variant} className="capitalize">
      {LABELS[status]}
    </Badge>
  )
}
