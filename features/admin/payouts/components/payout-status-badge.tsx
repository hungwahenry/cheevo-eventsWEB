import { Badge } from "@/components/ui/badge"
import type { AdminPayoutStatus } from "@/features/admin/payouts/types"

const VARIANT: Record<
  AdminPayoutStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  requested: "secondary",
  approved: "secondary",
  processing: "default",
  paid: "default",
  rejected: "outline",
  failed: "destructive",
}

export function PayoutStatusBadge({ status }: { status: AdminPayoutStatus }) {
  return <Badge variant={VARIANT[status]}>{status}</Badge>
}
