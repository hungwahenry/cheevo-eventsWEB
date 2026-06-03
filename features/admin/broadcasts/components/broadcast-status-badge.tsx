import { Badge } from "@/components/ui/badge"
import type { AdminBroadcastStatus } from "@/features/admin/broadcasts/types"

const VARIANT: Record<
  AdminBroadcastStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  queued: "secondary",
  sending: "default",
  sent: "default",
  failed: "destructive",
  cancelled: "outline",
}

export function BroadcastStatusBadge({
  status,
}: {
  status: AdminBroadcastStatus
}) {
  return <Badge variant={VARIANT[status]}>{status}</Badge>
}
