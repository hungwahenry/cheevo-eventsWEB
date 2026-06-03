import { Badge } from "@/components/ui/badge"
import type { AdminIssuedTicketStatus } from "@/features/admin/issued-tickets/types"

const VARIANT: Record<
  AdminIssuedTicketStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  valid: "default",
  scanned: "secondary",
  revoked: "destructive",
}

export function IssuedTicketStatusBadge({
  status,
}: {
  status: AdminIssuedTicketStatus
}) {
  return <Badge variant={VARIANT[status]}>{status}</Badge>
}
