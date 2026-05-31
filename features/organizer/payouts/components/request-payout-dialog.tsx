"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRequestPayout } from "@/features/organizer/payouts/hooks"
import { paystackTransferFee } from "@/features/organizer/payouts/lib/transfer-fees"
import type { Balance, PayoutAccount } from "@/features/organizer/payouts/types"
import { formatMoney, nairaInputToKobo } from "@/lib/format/money"
import { SendIcon } from "lucide-react"
import { useEffect, useState } from "react"

type Props = {
  orgId: string
  balance: Balance
  account: PayoutAccount | null
  hasInFlight: boolean
}

export function RequestPayoutDialog({
  orgId,
  balance,
  account,
  hasInFlight,
}: Props) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const request = useRequestPayout(orgId)

  useEffect(() => {
    if (!open) {
      setInput("")
      request.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const amountMinor = nairaInputToKobo(input) ?? 0
  const fees = amountMinor > 0 ? paystackTransferFee(amountMinor) : 0
  const net = Math.max(0, amountMinor - fees)
  const exceedsBalance = amountMinor > balance.available_minor

  const disabled =
    account === null ||
    hasInFlight ||
    balance.available_minor === 0

  const canSubmit =
    amountMinor > 0 && !exceedsBalance && !disabled && !request.isPending

  const handleMax = () => {
    setInput(String(balance.available_minor / 100))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    request.mutate(amountMinor, {
      onSuccess: () => setOpen(false),
    })
  }

  const triggerLabel = hasInFlight
    ? "Payout in review"
    : account === null
      ? "Add account first"
      : balance.available_minor === 0
        ? "Nothing to withdraw"
        : "Request payout"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <SendIcon className="size-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Request payout</DialogTitle>
            <DialogDescription>
              We&apos;ll review and approve, then transfer to your bank.
              Available: {formatMoney(balance.available_minor, balance.currency)}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">Amount (₦)</Label>
              <button
                type="button"
                onClick={handleMax}
                className="text-primary text-xs font-medium hover:underline">
                Use max
              </button>
            </div>
            <Input
              id="amount"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              placeholder="0"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            {exceedsBalance ? (
              <p className="text-destructive text-xs">
                Amount exceeds available balance.
              </p>
            ) : null}
          </div>

          {amountMinor > 0 && !exceedsBalance ? (
            <div className="bg-muted flex flex-col gap-1 rounded-lg p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transfer fee</span>
                <span className="tabular-nums">
                  {formatMoney(fees, balance.currency)}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Lands in your bank</span>
                <span className="tabular-nums">
                  {formatMoney(net, balance.currency)}
                </span>
              </div>
            </div>
          ) : null}

          {account ? (
            <p className="text-muted-foreground text-xs">
              → {account.account_name} · {account.bank_name} ·{" "}
              {account.account_number}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {request.isPending ? "Submitting…" : "Submit request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
