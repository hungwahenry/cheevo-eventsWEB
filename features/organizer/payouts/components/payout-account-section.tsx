"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { PayoutAccountForm } from "@/features/organizer/payouts/components/payout-account-form"
import {
  useDeletePayoutAccount,
  usePayoutAccount,
} from "@/features/organizer/payouts/hooks"
import { BanknoteIcon, CheckCircle2Icon } from "lucide-react"
import { useState } from "react"

export function PayoutAccountSection({ orgId }: { orgId: string }) {
  const { data: account, isLoading } = usePayoutAccount(orgId)
  const remove = useDeletePayoutAccount(orgId)
  const [open, setOpen] = useState(false)

  if (isLoading) {
    return (
      <section className="rounded-xl bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold">Payout account</h2>
        <Skeleton className="h-20 w-full" />
      </section>
    )
  }

  return (
    <section className="rounded-xl bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Payout account</h2>
        {account ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive">
                Remove
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove payout account?</AlertDialogTitle>
                <AlertDialogDescription>
                  Funds can&apos;t be paid out until you add a new account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={remove.isPending}
                  onClick={() => remove.mutate()}>
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>

      {account ? (
        <div className="flex items-start gap-3">
          <div className="bg-emerald-500/10 mt-0.5 flex size-9 items-center justify-center rounded-full">
            <CheckCircle2Icon className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium">{account.account_name}</p>
            <p className="text-muted-foreground text-sm">
              {account.bank_name} · {account.account_number}
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update payout account</DialogTitle>
                <DialogDescription>
                  We&apos;ll verify the new account against the bank before
                  saving.
                </DialogDescription>
              </DialogHeader>
              <PayoutAccountForm
                orgId={orgId}
                existing={account}
                onSaved={() => setOpen(false)}
                onCancel={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <BanknoteIcon className="size-4" />
              Add payout account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add payout account</DialogTitle>
              <DialogDescription>
                Where we&apos;ll send your ticket revenue. We verify the
                account name with your bank before saving.
              </DialogDescription>
            </DialogHeader>
            <PayoutAccountForm
              orgId={orgId}
              existing={null}
              onSaved={() => setOpen(false)}
              onCancel={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
