import { Badge } from "@/components/ui/badge"
import type { IssuedTicketStatus } from "@/features/organizer/events/issued-tickets/types"

const LABELS: Record<IssuedTicketStatus, string> = {
  valid: "Valid",
  scanned: "Used",
  revoked: "Revoked",
}

const VARIANTS: Record<
  IssuedTicketStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  valid: "default",
  scanned: "secondary",
  revoked: "destructive",
}

export function IssuedTicketStatusBadge({
  status,
}: {
  status: IssuedTicketStatus
}) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>
}
