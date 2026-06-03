"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ReasonDialog } from "@/features/admin/components/reason-dialog"
import { PaymentStatusBadge } from "@/features/admin/payments/components/payment-status-badge"
import {
  useMarkPaymentSuccess,
  usePayment,
  useResyncPayment,
} from "@/features/admin/payments/hooks"
import { formatMoney } from "@/lib/format/money"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function PaymentDetail({ id }: { id: string }) {
  const { data: payment, isLoading } = usePayment(id)
  const resync = useResyncPayment()
  const markSuccess = useMarkPaymentSuccess()
  const [successOpen, setSuccessOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }
  if (!payment) {
    return <div className="p-6 text-sm">Payment not found.</div>
  }

  const isTerminal = ["successful", "failed", "abandoned", "refunded"].includes(
    payment.status
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      <Link
        href="/admin/payments"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ChevronLeftIcon className="size-4" /> Payments
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {formatMoney(payment.amount_minor, payment.currency)}
          </h1>
          <p className="text-muted-foreground font-mono text-xs">
            {payment.reference}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{payment.provider}</Badge>
          <PaymentStatusBadge status={payment.status} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Provider response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted max-h-96 overflow-auto rounded-md p-3 text-xs leading-relaxed">
                {JSON.stringify(payment.provider_response ?? {}, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button
              variant="secondary"
              onClick={() => resync.mutate(payment.id)}
              disabled={resync.isPending}
            >
              Resync from provider
            </Button>
            {!isTerminal ? (
              <Button
                onClick={() => setSuccessOpen(true)}
                disabled={markSuccess.isPending}
              >
                Mark successful…
              </Button>
            ) : null}
            <div className="border-t pt-3 text-xs">
              <div className="text-muted-foreground">Buyer</div>
              <div className="font-medium">
                {payment.user?.email ?? "[deleted]"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ReasonDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Mark payment successful?"
        description="Flips this payment row to Successful. Use this for off-platform settlements you've confirmed manually."
        confirmLabel="Mark successful"
        isSubmitting={markSuccess.isPending}
        onConfirm={(reason) =>
          markSuccess.mutate(
            { id: payment.id, reason },
            { onSuccess: () => setSuccessOpen(false) }
          )
        }
      />
    </div>
  )
}
