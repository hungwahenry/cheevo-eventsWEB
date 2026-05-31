"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useBanks,
  useResolveBankAccount,
  useSavePayoutAccount,
} from "@/features/organizer/payouts/hooks"
import type { PayoutAccount } from "@/features/organizer/payouts/types"
import { isApiError } from "@/lib/api"
import { CheckIcon, Loader2Icon } from "lucide-react"
import { useEffect, useState } from "react"

type Props = {
  orgId: string
  existing: PayoutAccount | null
  onSaved?: () => void
  onCancel?: () => void
}

export function PayoutAccountForm({ orgId, existing, onCancel, onSaved }: Props) {
  const banks = useBanks()
  const resolve = useResolveBankAccount()
  const save = useSavePayoutAccount(orgId)

  const [bankCode, setBankCode] = useState(existing?.bank_code ?? "")
  const [accountNumber, setAccountNumber] = useState(
    existing?.account_number ?? ""
  )

  const trimmedAccount = accountNumber.trim()
  const accountReady =
    bankCode !== "" && /^\d{10}$/.test(trimmedAccount)

  useEffect(() => {
    if (!accountReady) {
      resolve.reset()
      return
    }
    const t = setTimeout(() => {
      resolve.mutate({ bankCode, accountNumber: trimmedAccount })
    }, 350)
    return () => clearTimeout(t)
  }, [bankCode, trimmedAccount, accountReady])

  const resolvedName = resolve.data?.account_name ?? null
  const resolveError =
    resolve.error && isApiError(resolve.error)
      ? resolve.error.message
      : resolve.error
        ? "Could not verify that account number."
        : null

  const canSubmit = accountReady && resolvedName !== null && !resolve.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    save.mutate(
      { bankCode, accountNumber: trimmedAccount },
      { onSuccess: () => onSaved?.() }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="bank">Bank</Label>
        {banks.isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select value={bankCode} onValueChange={setBankCode}>
            <SelectTrigger id="bank">
              <SelectValue placeholder="Select a bank" />
            </SelectTrigger>
            <SelectContent>
              {(banks.data ?? []).map((bank) => (
                <SelectItem key={bank.code} value={bank.code}>
                  {bank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="account">Account number</Label>
        <Input
          id="account"
          inputMode="numeric"
          autoComplete="off"
          maxLength={10}
          placeholder="0123456789"
          value={accountNumber}
          onChange={(e) =>
            setAccountNumber(e.target.value.replace(/\D/g, ""))
          }
        />
      </div>

      <div className="min-h-[1.5rem] text-sm">
        {resolve.isPending ? (
          <span className="text-muted-foreground inline-flex items-center gap-1.5">
            <Loader2Icon className="size-3.5 animate-spin" />
            Checking…
          </span>
        ) : resolvedName ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <CheckIcon className="size-3.5" />
            {resolvedName}
          </span>
        ) : resolveError ? (
          <span className="text-destructive">{resolveError}</span>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={!canSubmit || save.isPending}>
          {save.isPending ? "Saving…" : existing ? "Update" : "Save account"}
        </Button>
      </div>
    </form>
  )
}
