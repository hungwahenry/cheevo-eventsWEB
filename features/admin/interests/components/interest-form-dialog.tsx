"use client"

import { Button } from "@/components/ui/button"
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
import type {
  AdminInterest,
  UpsertInterestPayload,
} from "@/features/admin/interests/types"
import { useEffect, useState } from "react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  interest?: AdminInterest | null
  isSubmitting?: boolean
  onSubmit: (payload: UpsertInterestPayload) => void
}

export function InterestFormDialog({
  open,
  onOpenChange,
  interest,
  isSubmitting,
  onSubmit,
}: Props) {
  const [slug, setSlug] = useState("")
  const [name, setName] = useState("")
  const [sortOrder, setSortOrder] = useState("0")
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (open) {
      setSlug(interest?.slug ?? "")
      setName(interest?.name ?? "")
      setSortOrder(String(interest?.sort_order ?? 0))
      setIsActive(interest?.is_active ?? true)
    }
  }, [open, interest])

  const isEdit = Boolean(interest)
  const canSubmit =
    slug.trim().length > 0 && name.trim().length > 0 && !isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit interest" : "New interest"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="Slug" htmlFor="slug">
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="afrobeats"
              className="font-mono"
              disabled={isEdit}
            />
          </Field>
          <Field label="Name" htmlFor="name">
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Afrobeats"
            />
          </Field>
          <Field label="Sort order" htmlFor="sort_order">
            <Input
              id="sort_order"
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </Field>
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
                name: name.trim(),
                sort_order: Number(sortOrder) || 0,
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

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}
