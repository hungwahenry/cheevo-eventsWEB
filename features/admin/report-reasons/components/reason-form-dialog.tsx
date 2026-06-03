"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type {
  AdminReportReason,
  ReportReasonScope,
  UpsertReportReasonPayload,
} from "@/features/admin/report-reasons/types"
import { useEffect, useState } from "react"

const SCOPES: { value: ReportReasonScope; label: string }[] = [
  { value: "event", label: "Event" },
  { value: "comment", label: "Comment" },
  { value: "user", label: "User" },
  { value: "organisation", label: "Organisation" },
]

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  reason?: AdminReportReason | null
  isSubmitting?: boolean
  onSubmit: (payload: UpsertReportReasonPayload) => void
}

export function ReasonFormDialog({
  open,
  onOpenChange,
  reason,
  isSubmitting,
  onSubmit,
}: Props) {
  const [slug, setSlug] = useState("")
  const [label, setLabel] = useState("")
  const [description, setDescription] = useState("")
  const [scopes, setScopes] = useState<ReportReasonScope[]>([])
  const [displayOrder, setDisplayOrder] = useState("0")
  const [requiresDetails, setRequiresDetails] = useState(false)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (open) {
      setSlug(reason?.slug ?? "")
      setLabel(reason?.label ?? "")
      setDescription(reason?.description ?? "")
      setScopes(reason?.scope_types ?? [])
      setDisplayOrder(String(reason?.display_order ?? 0))
      setRequiresDetails(reason?.requires_details ?? false)
      setIsActive(reason?.is_active ?? true)
    }
  }, [open, reason])

  const isEdit = Boolean(reason)
  const canSubmit =
    slug.trim().length > 0 && label.trim().length > 0 && !isSubmitting

  const toggleScope = (scope: ReportReasonScope) => {
    setScopes((curr) =>
      curr.includes(scope) ? curr.filter((s) => s !== scope) : [...curr, scope]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit reason" : "New reason"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="fraud"
              className="font-mono"
              disabled={isEdit}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Fraud"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="When to use this reason."
            />
          </div>
          <div className="grid gap-2">
            <Label>Applies to</Label>
            <p className="text-muted-foreground text-xs">
              Leave empty to allow all target types.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SCOPES.map((s) => (
                <label
                  key={s.value}
                  className="flex items-center gap-2 rounded-md border p-2 text-sm"
                >
                  <Checkbox
                    checked={scopes.includes(s.value)}
                    onCheckedChange={() => toggleScope(s.value)}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="display_order">Display order</Label>
            <Input
              id="display_order"
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label htmlFor="requires_details">Requires details</Label>
            <Switch
              id="requires_details"
              checked={requiresDetails}
              onCheckedChange={setRequiresDetails}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label htmlFor="is_active">Active</Label>
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!canSubmit}
            onClick={() =>
              onSubmit({
                slug: slug.trim(),
                label: label.trim(),
                description: description.trim() || null,
                scope_types: scopes,
                display_order: Number(displayOrder) || 0,
                requires_details: requiresDetails,
                is_active: isActive,
              })
            }
          >
            {isEdit ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
