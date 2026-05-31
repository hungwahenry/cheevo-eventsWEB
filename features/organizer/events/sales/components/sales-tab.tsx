"use client"

import { OrdersList } from "@/features/organizer/events/sales/components/orders-list"
import { PerTicketBreakdown } from "@/features/organizer/events/sales/components/per-ticket-breakdown"
import { SalesSummary } from "@/features/organizer/events/sales/components/sales-summary"
import { useEventSales } from "@/features/organizer/events/sales/hooks"

export function SalesTab({ eventId }: { eventId: string }) {
  const { data: sales, isLoading } = useEventSales(eventId)

  if (isLoading || !sales) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <SalesSummary sales={sales} />
      <PerTicketBreakdown sales={sales} />

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Orders</h3>
        <OrdersList eventId={eventId} />
      </div>
    </div>
  )
}
