import { Badge } from "@/components/ui/badge"
import type { AdminOrderStatus } from "@/features/admin/orders/types"

const VARIANT: Record<
  AdminOrderStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "secondary",
  paid: "default",
  cancelled: "outline",
  refunded: "destructive",
}

export function OrderStatusBadge({ status }: { status: AdminOrderStatus }) {
  return <Badge variant={VARIANT[status]}>{status}</Badge>
}
