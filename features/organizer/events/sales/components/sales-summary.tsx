import type { EventSales } from "@/features/organizer/events/sales/types"
import { formatMoney } from "@/lib/format/money"
import {
  BanknoteIcon,
  ReceiptIcon,
  ShoppingBagIcon,
  TicketIcon,
} from "lucide-react"

export function SalesSummary({ sales }: { sales: EventSales }) {
  const stats = [
    {
      label: "Revenue",
      value: formatMoney(sales.revenue_minor, sales.currency),
      icon: BanknoteIcon,
    },
    {
      label: "Buyers paid",
      value: formatMoney(sales.gross_minor, sales.currency),
      icon: ReceiptIcon,
    },
    {
      label: "Tickets sold",
      value: sales.tickets_sold.toLocaleString(),
      icon: TicketIcon,
    },
    {
      label: "Orders",
      value: sales.orders_count.toLocaleString(),
      icon: ShoppingBagIcon,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-background">
            <stat.icon className="size-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-lg font-semibold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
