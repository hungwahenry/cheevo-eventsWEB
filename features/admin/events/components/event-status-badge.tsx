import { Badge } from "@/components/ui/badge"
import type { AdminEventStatus } from "@/features/admin/events/types"

const VARIANT: Record<
  AdminEventStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "outline",
  published: "default",
  past: "secondary",
}

export function EventStatusBadge({ status }: { status: AdminEventStatus }) {
  return <Badge variant={VARIANT[status]}>{status}</Badge>
}
