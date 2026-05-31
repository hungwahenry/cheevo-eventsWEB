"use client"

import { Skeleton } from "@/components/ui/skeleton"
import type {
  ActivityItem,
  ActivityType,
} from "@/features/organizer/dashboard/types"
import { formatMoney } from "@/lib/format/money"
import {
  CheckCircle2Icon,
  FlagIcon,
  MailIcon,
  SendIcon,
  ShoppingBagIcon,
  TicketIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

type Props = {
  items?: ActivityItem[]
  isLoading?: boolean
}

const ICONS: Record<ActivityType, LucideIcon> = {
  order_paid: ShoppingBagIcon,
  rsvp: UsersIcon,
  comment_flagged: FlagIcon,
  payout_requested: SendIcon,
  payout_paid: CheckCircle2Icon,
  ticket_scanned: TicketIcon,
}

function describe(item: ActivityItem): string {
  switch (item.type) {
    case "order_paid": {
      const buyer = (item.data.buyer_email as string | null) ?? "Someone"
      const event = (item.data.event_title as string | null) ?? "an event"
      const total = formatMoney(
        Number(item.data.total_minor ?? 0),
        String(item.data.currency ?? "NGN")
      )
      return `${buyer} paid ${total} for ${event}`
    }
    case "rsvp": {
      const user = (item.data.user_email as string | null) ?? "Someone"
      const event = (item.data.event_title as string | null) ?? "an event"
      return `${user} RSVPed to ${event}`
    }
    case "comment_flagged": {
      const flags = Number(item.data.flags_count ?? 0)
      return `Comment flagged · ${flags} report${flags === 1 ? "" : "s"}`
    }
    case "payout_requested": {
      const amount = formatMoney(
        Number(item.data.amount_minor ?? 0),
        String(item.data.currency ?? "NGN")
      )
      return `Requested payout of ${amount}`
    }
    case "payout_paid": {
      const amount = formatMoney(
        Number(item.data.amount_minor ?? 0),
        String(item.data.currency ?? "NGN")
      )
      return `Payout of ${amount} landed in your bank`
    }
    case "ticket_scanned": {
      const event = (item.data.event_title as string | null) ?? "an event"
      return `Ticket scanned at ${event}`
    }
  }
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return "now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

export function ActivityFeed({ items, isLoading }: Props) {
  return (
    <section className="bg-card rounded-xl p-5">
      <h3 className="mb-4 text-sm font-semibold">Recent activity</h3>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-full" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-2 py-6 text-center text-sm">
          <MailIcon className="size-5" />
          Quiet here. Activity will show up as it happens.
        </div>
      ) : (
        <ul className="flex flex-col">
          {items.map((item, idx) => {
            const Icon = ICONS[item.type]
            return (
              <li
                key={`${item.type}-${item.at}-${idx}`}
                className="flex items-start gap-3 py-2.5">
                <div className="bg-muted mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
                  <Icon className="text-muted-foreground size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{describe(item)}</p>
                  <p className="text-muted-foreground text-xs">
                    {relativeTime(item.at)}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
