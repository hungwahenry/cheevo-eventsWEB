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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import type { ActionReportInput } from "@/features/admin/reports/api"
import { useState } from "react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isSubmitting?: boolean
  onConfirm: (input: ActionReportInput) => void
}

const CHOICES: {
  value: ActionReportInput["action"]
  label: string
  hint: string
}[] = [
  {
    value: "delete_target",
    label: "Delete the target",
    hint: "Removes the reported comment / item.",
  },
  {
    value: "warn",
    label: "Warn",
    hint: "Record the action without removing the target.",
  },
  {
    value: "none",
    label: "No action",
    hint: "Close as actioned without touching the target.",
  },
]

export function ReportActionDialog({
  open,
  onOpenChange,
  isSubmitting,
  onConfirm,
}: Props) {
  const [action, setAction] = useState<ActionReportInput["action"]>("delete_target")
  const [note, setNote] = useState("")

  const trimmed = note.trim()
  const canSubmit = trimmed.length > 0 && !isSubmitting

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          setAction("delete_target")
          setNote("")
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Action report</DialogTitle>
          <DialogDescription>
            Choose how to resolve this report. The resolution note is recorded
            in the admin audit log.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <RadioGroup
            value={action}
            onValueChange={(v) => setAction(v as ActionReportInput["action"])}
            className="grid gap-2"
          >
            {CHOICES.map((c) => (
              <Label
                key={c.value}
                className="hover:bg-muted/50 flex items-start gap-3 rounded-md border p-3"
              >
                <RadioGroupItem value={c.value} />
                <div className="grid gap-0.5 text-left">
                  <span className="text-sm font-medium">{c.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {c.hint}
                  </span>
                </div>
              </Label>
            ))}
          </RadioGroup>

          <div className="grid gap-2">
            <Label htmlFor="note">Resolution note</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you find and what did you do?"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={action === "delete_target" ? "destructive" : "default"}
            disabled={!canSubmit}
            onClick={() => onConfirm({ action, resolution_note: trimmed })}
          >
            Apply action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
