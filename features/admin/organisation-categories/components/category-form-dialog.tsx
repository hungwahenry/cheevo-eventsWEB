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
  AdminOrganisationCategory,
  UpsertOrganisationCategoryPayload,
} from "@/features/admin/organisation-categories/types"
import { useEffect, useState } from "react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: AdminOrganisationCategory | null
  isSubmitting?: boolean
  onSubmit: (payload: UpsertOrganisationCategoryPayload) => void
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  isSubmitting,
  onSubmit,
}: Props) {
  const [slug, setSlug] = useState("")
  const [name, setName] = useState("")
  const [sortOrder, setSortOrder] = useState("0")
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (open) {
      setSlug(category?.slug ?? "")
      setName(category?.name ?? "")
      setSortOrder(String(category?.sort_order ?? 0))
      setIsActive(category?.is_active ?? true)
    }
  }, [open, category])

  const isEdit = Boolean(category)
  const canSubmit =
    slug.trim().length > 0 && name.trim().length > 0 && !isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit category" : "New category"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="clubs"
              className="font-mono"
              disabled={isEdit}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Clubs"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sort_order">Sort order</Label>
            <Input
              id="sort_order"
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
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
