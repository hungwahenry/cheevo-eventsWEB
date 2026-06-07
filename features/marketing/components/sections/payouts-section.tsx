import { BanknoteIcon, ClockIcon, SendIcon } from "lucide-react"

import { loadPricing } from "@/features/marketing/api"

const BALANCE = [
  {
    label: "Available",
    value: "₦1,840,000",
    hint: "Ready to pay out.",
    Icon: BanknoteIcon,
  },
  {
    label: "Pending",
    value: "₦420,000",
    hint: null as string | null,
    Icon: ClockIcon,
  },
  {
    label: "Paid out",
    value: "₦5,200,000",
    hint: "All-time.",
    Icon: SendIcon,
  },
]

const RECENT_PAYOUTS = [
  { date: "May 24", amount: "₦1,400,000", status: "Paid" },
  { date: "May 17", amount: "₦820,000", status: "Paid" },
  { date: "May 10", amount: "₦340,000", status: "Paid" },
]

export async function PayoutsSection() {
  const pricing = await loadPricing()
  const days = pricing.holdWindowDays
  const balance = BALANCE.map((b) =>
    b.label === "Pending"
      ? {
          ...b,
          hint: `Settles ${days} day${days === 1 ? "" : "s"} after the sale clears.`,
        }
      : b
  )

  return (
    <section className="px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
            Money, when it matters
          </p>
          <h2 className="max-w-2xl text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em]">
            Cash out in {days} days. Not 30.
          </h2>
          <p className="max-w-xl text-base text-foreground/65">
            Every paid order clears to your available balance{" "}
            {days} day{days === 1 ? "" : "s"} after the sale. Request a
            payout whenever you want — straight to your Nigerian bank
            account.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-3">
            {balance.map((b) => (
              <BalanceCard key={b.label} {...b} />
            ))}
          </div>

          <div className="rounded-xl border border-foreground/10 bg-card p-5 lg:col-span-2">
            <div className="mb-4 flex items-baseline justify-between">
              <p className="text-sm font-semibold">Recent payouts</p>
              <span className="text-xs text-foreground/55">Last 30 days</span>
            </div>
            <ul className="flex flex-col gap-3 divide-y divide-foreground/5">
              {RECENT_PAYOUTS.map((p, i) => (
                <li
                  key={p.date}
                  className={
                    "flex items-center justify-between gap-3 " +
                    (i > 0 ? "pt-3" : "")
                  }
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium tabular-nums">
                      {p.amount}
                    </span>
                    <span className="text-xs text-foreground/55">
                      {p.date} &middot; GTBank ••• 4421
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                    {p.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function BalanceCard({
  label,
  value,
  hint,
  Icon,
}: {
  label: string
  value: string
  hint: string | null
  Icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-foreground/10 bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/55">
          {label}
        </p>
        <span className="flex size-7 items-center justify-center rounded-full bg-foreground/[0.04] text-foreground/65">
          <Icon className="size-3.5" />
        </span>
      </div>
      <p className="text-xl font-bold tracking-tight tabular-nums">{value}</p>
      {hint ? (
        <p className="text-[11px] text-foreground/55">{hint}</p>
      ) : null}
    </div>
  )
}
