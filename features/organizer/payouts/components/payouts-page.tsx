"use client"

import { BalanceCards } from "@/features/organizer/payouts/components/balance-cards"
import { PayoutAccountSection } from "@/features/organizer/payouts/components/payout-account-section"
import { PerEventBalanceTable } from "@/features/organizer/payouts/components/per-event-balance-table"
import { useBalance } from "@/features/organizer/payouts/hooks"

export function PayoutsPage({ orgId }: { orgId: string }) {
  const { data: balance, isLoading } = useBalance(orgId)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payouts</h1>
        <p className="text-muted-foreground text-sm">
          Ticket revenue and your payout account.
        </p>
      </div>

      <BalanceCards balance={balance} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold">Revenue by event</h2>
          <PerEventBalanceTable balance={balance} isLoading={isLoading} />
        </div>
        <div>
          <PayoutAccountSection orgId={orgId} />
        </div>
      </div>
    </div>
  )
}
