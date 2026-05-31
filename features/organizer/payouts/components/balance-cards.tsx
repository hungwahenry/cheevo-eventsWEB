"use client"

import { Skeleton } from "@/components/ui/skeleton"
import type { Balance } from "@/features/organizer/payouts/types"
import { formatMoney } from "@/lib/format/money"
import { BanknoteIcon, ClockIcon, SendIcon } from "lucide-react"

type Props = {
  balance?: Balance
  isLoading?: boolean
}

export function BalanceCards({ balance, isLoading }: Props) {
  if (isLoading || !balance) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: "Available",
      value: formatMoney(balance.available_minor, balance.currency),
      icon: BanknoteIcon,
      hint: "Ready to pay out.",
    },
    {
      label: "Pending",
      value: formatMoney(balance.pending_minor, balance.currency),
      icon: ClockIcon,
      hint: `Settling — clears ${balance.hold_window_days} day${balance.hold_window_days === 1 ? "" : "s"} after each sale.`,
    },
    {
      label: "Paid out",
      value: formatMoney(balance.paid_out_minor, balance.currency),
      icon: SendIcon,
      hint: "Total sent to your account.",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col gap-3 rounded-xl bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              {card.label}
            </span>
            <card.icon className="text-muted-foreground size-4" />
          </div>
          <p className="text-2xl font-semibold tabular-nums">{card.value}</p>
          <p className="text-muted-foreground text-xs">{card.hint}</p>
        </div>
      ))}
    </div>
  )
}
