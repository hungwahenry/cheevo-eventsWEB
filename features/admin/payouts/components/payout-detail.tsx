"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ReasonDialog } from "@/features/admin/components/reason-dialog"
import { PayoutStatusBadge } from "@/features/admin/payouts/components/payout-status-badge"
import {
  useApprovePayout,
  useMarkPayoutPaid,
  usePayout,
  useRejectPayout,
  useRetryPayout,
} from "@/features/admin/payouts/hooks"
import { formatMoney } from "@/lib/format/money"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function PayoutDetail({ id }: { id: string }) {
  const { data: payout, isLoading } = usePayout(id)
  const approve = useApprovePayout()
  const reject = useRejectPayout()
  const markPaid = useMarkPayoutPaid()
  const retry = useRetryPayout()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [paidOpen, setPaidOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }
  if (!payout) {
    return <div className="p-6 text-sm">Payout not found.</div>
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <Link
        href="/admin/payouts"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ChevronLeftIcon className="size-4" /> Payouts
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {formatMoney(payout.net_minor, payout.currency)}
          </h1>
          <p className="text-muted-foreground text-sm">
            {payout.organisation?.name ?? "—"} ·{" "}
            {formatMoney(payout.amount_minor, payout.currency)} gross
          </p>
        </div>
        <PayoutStatusBadge status={payout.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Destination</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm md:grid-cols-2">
              <Field label="Bank" value={payout.bank_name} />
              <Field label="Account" value={payout.account_number} mono />
              <Field label="Account name" value={payout.account_name} />
              <Field label="Provider" value={payout.provider} />
              <Field
                label="Provider reference"
                value={payout.provider_reference ?? "—"}
                mono
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-1 text-sm">
              <Row
                label="Gross"
                value={formatMoney(payout.amount_minor, payout.currency)}
              />
              <Row
                label="Fees"
                value={formatMoney(payout.fees_minor, payout.currency)}
              />
              <Row
                label={<span className="font-semibold">Net to organiser</span>}
                value={
                  <span className="font-semibold">
                    {formatMoney(payout.net_minor, payout.currency)}
                  </span>
                }
              />
            </CardContent>
          </Card>

          {payout.failed_reason ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Failure</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {payout.failed_reason}
              </CardContent>
            </Card>
          ) : null}

          {payout.review_notes ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Review note</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {payout.review_notes}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {payout.status === "requested" ? (
              <>
                <Button
                  onClick={() => approve.mutate({ id: payout.id })}
                  disabled={approve.isPending}
                >
                  Approve & initiate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setRejectOpen(true)}
                  disabled={reject.isPending}
                >
                  Reject…
                </Button>
              </>
            ) : null}
            {payout.status === "failed" ? (
              <Button
                onClick={() => retry.mutate(payout.id)}
                disabled={retry.isPending}
              >
                Retry transfer
              </Button>
            ) : null}
            {(payout.status === "approved" || payout.status === "processing") ? (
              <Button
                variant="secondary"
                onClick={() => setPaidOpen(true)}
                disabled={markPaid.isPending}
              >
                Mark paid…
              </Button>
            ) : null}
            <div className="border-t pt-3 text-xs">
              <div className="text-muted-foreground">Requested by</div>
              <div className="font-medium">
                {payout.requested_by?.email ?? "—"}
              </div>
              {payout.reviewed_by ? (
                <>
                  <div className="text-muted-foreground mt-2">Reviewed by</div>
                  <div className="font-medium">
                    {payout.reviewed_by.email}
                  </div>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <ReasonDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Reject payout?"
        description="Rejected payouts can't be re-approved. Add a clear reason for the organiser."
        confirmLabel="Reject"
        destructive
        isSubmitting={reject.isPending}
        onConfirm={(note) =>
          reject.mutate(
            { id: payout.id, note },
            { onSuccess: () => setRejectOpen(false) }
          )
        }
      />

      <ReasonDialog
        open={paidOpen}
        onOpenChange={setPaidOpen}
        title="Mark payout paid?"
        description="Manual override for off-platform settlements. Use only if the provider transfer succeeded out-of-band."
        confirmLabel="Mark paid"
        isSubmitting={markPaid.isPending}
        onConfirm={(note) =>
          markPaid.mutate(
            { id: payout.id, note },
            { onSuccess: () => setPaidOpen(false) }
          )
        }
      />
    </div>
  )
}

function Row({
  label,
  value,
}: {
  label: React.ReactNode
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

function Field({
  label,
  value,
  mono,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="grid gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={mono ? "font-mono text-xs" : ""}>{value ?? "—"}</span>
    </div>
  )
}
