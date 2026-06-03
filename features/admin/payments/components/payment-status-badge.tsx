import { Badge } from "@/components/ui/badge"
import type { AdminPaymentStatus } from "@/features/admin/payments/types"

const VARIANT: Record<
  AdminPaymentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "secondary",
  successful: "default",
  failed: "destructive",
  abandoned: "outline",
  refunded: "destructive",
}

export function PaymentStatusBadge({
  status,
}: {
  status: AdminPaymentStatus
}) {
  return <Badge variant={VARIANT[status]}>{status}</Badge>
}
