import { CheckIcon } from "lucide-react"

type Tier = {
  name: string
  price: string
  status: "selling fast" | "on sale" | "presale"
  capacity: string
  perks: string[]
  highlight?: boolean
}

const TIERS: Tier[] = [
  {
    name: "General entry",
    price: "₦15,000",
    status: "selling fast",
    capacity: "45 of 200 left",
    perks: ["Includes welcome cocktail", "Doors open 4 PM"],
  },
  {
    name: "VIP table",
    price: "₦120,000",
    status: "on sale",
    capacity: "3 of 12 left",
    perks: [
      "Reserved table for 4",
      "Bottle service included",
      "VIP entrance",
    ],
    highlight: true,
  },
  {
    name: "Late entry",
    price: "₦10,000",
    status: "presale",
    capacity: "Opens 9 PM",
    perks: ["After 9 PM only", "No drink included"],
  },
]

export function TicketsSection() {
  return (
    <section className="bg-foreground/[0.02] px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
            Tickets, not spreadsheets
          </p>
          <h2 className="max-w-2xl text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em]">
            Price your event the way it actually runs.
          </h2>
          <p className="max-w-xl text-base text-foreground/65">
            Tiered tickets, presale windows, capacity caps, sold-out
            states — set it once and the app handles availability for
            every attendee in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {TIERS.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TierCard({ tier }: { tier: Tier }) {
  return (
    <div
      className={
        "relative flex flex-col gap-4 rounded-2xl border p-5 transition-transform md:p-6 " +
        (tier.highlight
          ? "border-primary/30 bg-card shadow-[0_25px_60px_-25px_rgba(218,114,46,0.35)] md:-translate-y-2"
          : "border-foreground/10 bg-card")
      }
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold tracking-tight">{tier.name}</p>
        <StatusPill status={tier.status} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-3xl font-bold tracking-tight tabular-nums">
          {tier.price}
        </p>
        <p className="text-xs text-foreground/55">{tier.capacity}</p>
      </div>
      <ul className="flex flex-col gap-2 border-t border-foreground/10 pt-4">
        {tier.perks.map((perk) => (
          <li
            key={perk}
            className="flex items-center gap-2 text-sm text-foreground/75"
          >
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <CheckIcon className="size-2.5" strokeWidth={3} />
            </span>
            {perk}
          </li>
        ))}
      </ul>
    </div>
  )
}

function StatusPill({ status }: { status: Tier["status"] }) {
  const styles =
    status === "selling fast"
      ? "bg-destructive/15 text-destructive"
      : status === "presale"
        ? "bg-foreground/10 text-foreground/65"
        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
  return (
    <span
      className={
        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] " +
        styles
      }
    >
      {status}
    </span>
  )
}
