"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { ChangeEmailDialog } from "@/features/account/components/change-email-dialog"
import { DeleteAccountDialog } from "@/features/account/components/delete-account-dialog"
import { ExportDataButton } from "@/features/account/components/export-data-button"
import { useMe } from "@/features/auth"

export function AccountSettings() {
  const { data: user, isLoading } = useMe()

  if (isLoading || !user) {
    return (
      <div className="flex max-w-3xl flex-col gap-8">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <section className="bg-card rounded-xl p-5">
        <h2 className="mb-4 text-sm font-semibold">Account</h2>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs tracking-wide uppercase">
              Email
            </span>
            <span className="text-sm font-medium">{user.email}</span>
          </div>
          <ChangeEmailDialog />
        </div>
      </section>

      <section className="bg-card rounded-xl p-5">
        <h2 className="mb-1 text-sm font-semibold">Your data</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Download a copy of your cheevo data as JSON.
        </p>
        <ExportDataButton />
      </section>

      <section className="border-destructive/30 rounded-xl border p-5">
        <h2 className="text-destructive mb-1 text-sm font-semibold">
          Danger zone
        </h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Permanently delete your account. This can’t be undone.
        </p>
        <DeleteAccountDialog />
      </section>
    </div>
  )
}
