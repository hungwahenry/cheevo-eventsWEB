import type { TicketStatus } from "@/features/organizer/events/tickets/types"

const STATUS_LABELS: Record<TicketStatus, string> = {
  draft: "Draft",
  on_sale: "On sale",
  paused: "Paused",
}

export function formatTicketStatus(status: TicketStatus): string {
  return STATUS_LABELS[status]
}
