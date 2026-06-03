"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { RefundOrderInput } from "@/features/admin/orders/api"
import { formatMoney } from "@/lib/format/money"
import { useState } from "react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  amountMinor: number
  currency: string
  isSubmitting?: boolean
  onConfirm: (input: RefundOrderInput) => void
}

export function RefundDialog({
  open,
  onOpenChange,
  amountMinor,
  currency,
  isSubmitting,
  onConfirm,
}: Props) {
  const [reason, setReason] = useState("")
  const [notify, setNotify] = useState(true)

  const canSubmit = reason.trim().length > 0 && !isSubmitting

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          setReason("")
          setNotify(true)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Refund {formatMoney(amountMinor, currency)}?
          </DialogTitle>
          <DialogDescription>
            Marks the order refunded and revokes unscanned tickets. Process the
            actual provider refund in the Paystack / Flutterwave dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Label htmlFor="reason">Reason</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Duplicate purchase, fraud, etc."
            rows={3}
            autoFocus
          />
          <Label className="flex items-center gap-2 text-sm font-normal">
            <Checkbox
              checked={notify}
              onCheckedChange={(v) => setNotify(Boolean(v))}
            />
            Notify the buyer
          </Label>
          <p className="text-muted-foreground text-xs">
            This is recorded in the admin audit log.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!canSubmit}
            onClick={() =>
              onConfirm({
                amount_minor: amountMinor,
                reason: reason.trim(),
                notify_user: notify,
              })
            }
          >
            Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
