"use client"

import { Skeleton } from "@/components/ui/skeleton"
import type { TopEvent } from "@/features/organizer/dashboard/types"
import { formatMoney } from "@/lib/format/money"
import Link from "next/link"

type Props = {
  events?: TopEvent[]
  currency: string
  isLoading?: boolean
}

export function TopEvents({ events, currency, isLoading }: Props) {
  return (
    <section className="bg-card rounded-xl p-5">
      <h3 className="mb-4 text-sm font-semibold">Top events</h3>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-12 w-full" />
          ))}
        </div>
      ) : !events || events.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No revenue in this period.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {events.map((event) => (
            <li key={event.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={`/organizer/events/${event.id}`}
                  className="truncate text-sm font-medium hover:underline">
                  {event.title}
                </Link>
                <span className="font-semibold tabular-nums">
                  {formatMoney(event.revenue_minor, currency)}
                </span>
              </div>
              <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${event.share_pct}%` }}
                />
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>{event.tickets_sold.toLocaleString()} tickets</span>
                <span>{event.share_pct.toFixed(0)}% of total</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
