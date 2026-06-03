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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { AdminOrganisation } from "@/features/admin/organisations/types"
import { useEffect, useState } from "react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  organisation: AdminOrganisation
  isSubmitting?: boolean
  onConfirm: (userId: string, reason?: string) => void
}

export function ChangeOwnerDialog({
  open,
  onOpenChange,
  organisation,
  isSubmitting,
  onConfirm,
}: Props) {
  const [userId, setUserId] = useState<string>("")
  const [reason, setReason] = useState("")
  const candidates = (organisation.members ?? []).filter((m) => !m.is_owner)
  const canSubmit = userId.length > 0 && !isSubmitting

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
          <DialogTitle>Change owner</DialogTitle>
          <DialogDescription>
            Promote an existing member to owner. The current owner becomes a
            regular member.
          </DialogDescription>
        </DialogHeader>
        {candidates.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            No eligible members. Add a member first.
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-owner">New owner</Label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger id="new-owner">
                  <SelectValue placeholder="Select a member…" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.username ? `@${m.username}` : m.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Why are you doing this?"
              />
              <p className="text-muted-foreground text-xs">
                Recorded in the admin audit log.
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!canSubmit}
            onClick={() => onConfirm(userId, reason.trim() || undefined)}
          >
            Change owner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
