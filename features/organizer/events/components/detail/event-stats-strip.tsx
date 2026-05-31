import type { EventItem } from "@/features/organizer/events/types"
import { MessageCircleIcon, TicketIcon, UsersIcon } from "lucide-react"

type Stat = {
  label: string
  value: number | string
  icon: typeof UsersIcon
}

export function EventStatsStrip({ event }: { event: EventItem }) {
  const stats: Stat[] = [
    {
      label: "Going",
      value: event.rsvps_count.toLocaleString(),
      icon: UsersIcon,
    },
    {
      label: "Comments",
      value: event.comments_count.toLocaleString(),
      icon: MessageCircleIcon,
    },
    {
      label: "Tickets",
      value: event.tickets_count.toLocaleString(),
      icon: TicketIcon,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}

function StatCard({ label, value, icon: Icon }: Stat) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
      <div className="flex size-10 items-center justify-center rounded-full bg-background">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  )
}
