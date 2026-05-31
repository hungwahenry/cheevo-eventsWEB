"use client"

import { Skeleton } from "@/components/ui/skeleton"
import type {
  DashboardKpis,
  KpiMetric,
} from "@/features/organizer/dashboard/types"
import { cn } from "@/lib/utils"
import { formatMoney } from "@/lib/format/money"
import { ArrowDownRightIcon, ArrowUpRightIcon, MinusIcon } from "lucide-react"

type Props = {
  kpis?: DashboardKpis
  currency: string
  isLoading?: boolean
}

const CARDS: { metric: KpiMetric; label: string; format: (n: number, c: string) => string }[] = [
  {
    metric: "revenue_minor",
    label: "Revenue",
    format: (n, c) => formatMoney(n, c),
  },
  {
    metric: "tickets",
    label: "Tickets sold",
    format: (n) => n.toLocaleString(),
  },
  {
    metric: "orders",
    label: "Orders",
    format: (n) => n.toLocaleString(),
  },
  {
    metric: "rsvps",
    label: "RSVPs",
    format: (n) => n.toLocaleString(),
  },
]

export function KpiCards({ kpis, currency, isLoading }: Props) {
  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {CARDS.map((card) => {
        const kpi = kpis[card.metric]
        return (
          <div
            key={card.metric}
            className="bg-card flex flex-col gap-2 rounded-xl p-4">
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              {card.label}
            </span>
            <p className="text-2xl font-semibold tabular-nums">
              {card.format(kpi.current, currency)}
            </p>
            <DeltaBadge delta={kpi.delta_pct} />
          </div>
        )
      })}
    </div>
  )
}

function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta === null) {
    return (
      <p className="text-muted-foreground flex items-center gap-1 text-xs">
        <MinusIcon className="size-3" />
        New
      </p>
    )
  }
  if (delta === 0) {
    return (
      <p className="text-muted-foreground flex items-center gap-1 text-xs">
        <MinusIcon className="size-3" />
        No change
      </p>
    )
  }
  const positive = delta > 0
  return (
    <p
      className={cn(
        "flex items-center gap-1 text-xs font-medium",
        positive
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-destructive"
      )}>
      {positive ? (
        <ArrowUpRightIcon className="size-3.5" />
      ) : (
        <ArrowDownRightIcon className="size-3.5" />
      )}
      {Math.abs(delta).toFixed(1)}%
    </p>
  )
}
