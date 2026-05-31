import type { EventSales } from "@/features/organizer/events/sales/types"
import { formatMoney } from "@/lib/format/money"

export function PerTicketBreakdown({ sales }: { sales: EventSales }) {
  if (sales.per_ticket.length === 0) {
    return null
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 text-left font-medium">Ticket</th>
            <th className="px-4 py-2.5 text-right font-medium">Sold</th>
            <th className="px-4 py-2.5 text-right font-medium">Revenue</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {sales.per_ticket.map((row) => (
            <tr key={row.ticket_id}>
              <td className="px-4 py-3 font-medium">{row.name}</td>
              <td className="px-4 py-3 text-right tabular-nums">
                {row.sold_count.toLocaleString()}
                {row.quantity !== null ? (
                  <span className="text-muted-foreground">
                    {" "}
                    / {row.quantity.toLocaleString()}
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatMoney(row.revenue_minor, sales.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
