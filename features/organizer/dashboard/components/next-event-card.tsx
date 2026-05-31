"use client"

import { Skeleton } from "@/components/ui/skeleton"
import type { NextEvent } from "@/features/organizer/dashboard/types"
import { formatMoney } from "@/lib/format/money"
import { CalendarIcon, MapPinIcon, TicketIcon } from "lucide-react"
import Link from "next/link"

type Props = {
  event?: NextEvent | null
  currency: string
  isLoading?: boolean
}

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
}

function relativeDays(iso: string): string {
  const days = Math.round(
    (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  if (days <= 0) return "today"
  if (days === 1) return "tomorrow"
  return `in ${days} days`
}

export function NextEventCard({ event, currency, isLoading }: Props) {
  if (isLoading) {
    return <Skeleton className="h-36 w-full rounded-xl" />
  }

  if (!event) {
    return (
      <section className="bg-card rounded-xl p-5">
        <h3 className="mb-2 text-sm font-semibold">Next event</h3>
        <p className="text-muted-foreground text-sm">
          No upcoming events. Create one to start selling tickets.
        </p>
      </section>
    )
  }

  const when = event.starts_at
    ? new Date(event.starts_at).toLocaleString(undefined, DATE_OPTS)
    : null
  const distance = event.starts_at ? relativeDays(event.starts_at) : null
  const venue = event.venue_name ?? event.city

  return (
    <Link
      href={`/organizer/events/${event.id}`}
      className="bg-card flex gap-4 rounded-xl p-4 transition-opacity hover:opacity-90">
      <div className="bg-muted relative h-24 w-20 shrink-0 overflow-hidden rounded-lg">
        {event.flyer_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.flyer_url} alt="" className="size-full object-cover" />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Next event
          </h3>
          {distance ? (
            <span className="text-muted-foreground text-xs">· {distance}</span>
          ) : null}
        </div>
        <p className="truncate font-semibold">{event.title}</p>
        {when ? (
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <CalendarIcon className="size-3" />
            {when}
          </div>
        ) : null}
        {venue ? (
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <MapPinIcon className="size-3" />
            <span className="truncate">{venue}</span>
          </div>
        ) : null}
        <div className="text-foreground mt-1 flex items-center gap-3 text-xs font-medium">
          <span className="flex items-center gap-1">
            <TicketIcon className="size-3.5" />
            {event.tickets_sold.toLocaleString()} sold
          </span>
          <span>{formatMoney(event.revenue_minor, currency)} revenue</span>
        </div>
      </div>
    </Link>
  )
}
