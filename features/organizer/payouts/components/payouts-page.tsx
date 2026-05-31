"use client"

import { BalanceCards } from "@/features/organizer/payouts/components/balance-cards"
import { PayoutAccountSection } from "@/features/organizer/payouts/components/payout-account-section"
import { PayoutsHistoryTable } from "@/features/organizer/payouts/components/payouts-history-table"
import { PerEventBalanceTable } from "@/features/organizer/payouts/components/per-event-balance-table"
import { RequestPayoutDialog } from "@/features/organizer/payouts/components/request-payout-dialog"
import {
  useBalance,
  usePayoutAccount,
  usePayouts,
} from "@/features/organizer/payouts/hooks"

const IN_FLIGHT_STATUSES = ["requested", "approved", "processing"] as const

export function PayoutsPage({ orgId }: { orgId: string }) {
  const { data: balance, isLoading: balanceLoading } = useBalance(orgId)
  const { data: account } = usePayoutAccount(orgId)
  const { data: payouts } = usePayouts(orgId, 1)

  const hasInFlight =
    payouts?.items.some((p) =>
      (IN_FLIGHT_STATUSES as readonly string[]).includes(p.status)
    ) ?? false

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Payouts</h1>
          <p className="text-muted-foreground text-sm">
            Ticket revenue and your payout account.
          </p>
        </div>
        {balance ? (
          <RequestPayoutDialog
            orgId={orgId}
            balance={balance}
            account={account ?? null}
            hasInFlight={hasInFlight}
          />
        ) : null}
      </div>

      <BalanceCards balance={balance} isLoading={balanceLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold">Revenue by event</h2>
          <PerEventBalanceTable balance={balance} isLoading={balanceLoading} />
        </div>
        <div>
          <PayoutAccountSection orgId={orgId} />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold">Payout history</h2>
        <PayoutsHistoryTable orgId={orgId} />
      </div>
    </div>
  )
}
