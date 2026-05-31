import { Badge } from "@/components/ui/badge"
import type { PayoutStatus } from "@/features/organizer/payouts/types"

const LABELS: Record<PayoutStatus, string> = {
  requested: "In review",
  approved: "Approved",
  processing: "Processing",
  paid: "Paid",
  rejected: "Rejected",
  failed: "Failed",
}

const VARIANTS: Record<
  PayoutStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  requested: "secondary",
  approved: "secondary",
  processing: "secondary",
  paid: "default",
  rejected: "destructive",
  failed: "destructive",
}

export function PayoutStatusBadge({ status }: { status: PayoutStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>
}
