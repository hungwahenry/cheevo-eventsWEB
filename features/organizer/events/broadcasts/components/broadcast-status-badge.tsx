import { Badge } from "@/components/ui/badge"
import type { BroadcastStatus } from "@/features/organizer/events/broadcasts/types"

const LABELS: Record<BroadcastStatus, string> = {
  queued: "Queued",
  sending: "Sending",
  sent: "Sent",
  failed: "Failed",
  cancelled: "Cancelled",
}

export function BroadcastStatusBadge({ status }: { status: BroadcastStatus }) {
  const variant: React.ComponentProps<typeof Badge>["variant"] =
    status === "sent"
      ? "default"
      : status === "sending" || status === "queued"
        ? "secondary"
        : "outline"

  return <Badge variant={variant}>{LABELS[status]}</Badge>
}
