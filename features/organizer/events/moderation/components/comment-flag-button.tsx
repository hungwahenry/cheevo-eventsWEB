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
import { Textarea } from "@/components/ui/textarea"
import { useToggleFlag } from "@/features/organizer/events/moderation/hooks"
import type { ModerationComment } from "@/features/organizer/events/moderation/types"
import { FlagIcon } from "lucide-react"
import { useState } from "react"

const MAX_REASON = 500

export function CommentFlagButton({
  comment,
}: {
  comment: ModerationComment
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [reason, setReason] = useState("")
  const toggle = useToggleFlag(comment.event_id)

  const handleClick = () => {
    if (comment.is_flagged_by_me) {
      toggle.mutate({ comment, next: false })
    } else {
      setDialogOpen(true)
    }
  }

  const submit = () => {
    toggle.mutate(
      { comment, next: true, reason: reason.trim() || undefined },
      {
        onSuccess: () => {
          setDialogOpen(false)
          setReason("")
        },
      }
    )
  }

  const cancel = () => {
    setDialogOpen(false)
    setReason("")
  }

  return (
    <>
      <Button
        variant={comment.is_flagged_by_me ? "default" : "outline"}
        size="sm"
        disabled={toggle.isPending}
        onClick={handleClick}
      >
        <FlagIcon className="size-3.5" />
        {comment.is_flagged_by_me ? "Flagged" : "Flag"}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={(o) => (o ? setDialogOpen(o) : cancel())}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Flag this comment</DialogTitle>
            <DialogDescription>
              An admin will review this. Add context if it helps them decide.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="flag-reason">
              Reason{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="flag-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, MAX_REASON))}
              placeholder="e.g. Spam, harassment, off-topic…"
              rows={4}
              maxLength={MAX_REASON}
            />
            <p className="self-end text-xs text-muted-foreground">
              {reason.length}/{MAX_REASON}
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={cancel}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={toggle.isPending}>
              <FlagIcon className="size-3.5" />
              Flag for review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
