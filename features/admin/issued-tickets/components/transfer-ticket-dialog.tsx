"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isSubmitting?: boolean
  onConfirm: (userId: string, reason?: string) => void
}

export function TransferTicketDialog({
  open,
  onOpenChange,
  isSubmitting,
  onConfirm,
}: Props) {
  const [userId, setUserId] = useState("")
  const [reason, setReason] = useState("")
  const canSubmit = userId.trim().length === 26 && !isSubmitting

  useEffect(() => {
    if (!open) {
      setUserId("")
      setReason("")
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer ticket</DialogTitle>
          <DialogDescription>
            Reassigns the ticket holder. The previous holder loses access.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="to-user">New holder user ID</Label>
            <Input
              id="to-user"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="01HX… (26 chars)"
              className="font-mono"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Lost phone, etc."
            />
            <p className="text-muted-foreground text-xs">
              Recorded in the admin audit log.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!canSubmit}
            onClick={() => onConfirm(userId.trim(), reason.trim() || undefined)}
          >
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
