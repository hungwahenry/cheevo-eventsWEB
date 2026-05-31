"use client"

import { CsvExportButton } from "@/components/csv-export-button"
import { AnalyticsCharts } from "@/features/organizer/events/sales/components/analytics-charts"
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
      <AnalyticsCharts eventId={eventId} />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Orders</h3>
          <CsvExportButton
            href={`/api/organizer/events/${eventId}/orders/export`}
          />
        </div>
        <OrdersList eventId={eventId} />
      </div>
    </div>
  )
}
