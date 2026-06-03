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
  AdminSocialPlatform,
  UpsertSocialPlatformPayload,
} from "@/features/admin/social-platforms/types"
import { useEffect, useState } from "react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  platform?: AdminSocialPlatform | null
  isSubmitting?: boolean
  onSubmit: (payload: UpsertSocialPlatformPayload) => void
}

export function PlatformFormDialog({
  open,
  onOpenChange,
  platform,
  isSubmitting,
  onSubmit,
}: Props) {
  const [slug, setSlug] = useState("")
  const [name, setName] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [sortOrder, setSortOrder] = useState("0")
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (open) {
      setSlug(platform?.slug ?? "")
      setName(platform?.name ?? "")
      setBaseUrl(platform?.base_url ?? "")
      setSortOrder(String(platform?.sort_order ?? 0))
      setIsActive(platform?.is_active ?? true)
    }
  }, [open, platform])

  const isEdit = Boolean(platform)
  const canSubmit =
    slug.trim().length > 0 && name.trim().length > 0 && !isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit platform" : "New platform"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="tiktok"
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
              placeholder="TikTok"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="base_url">
              Base URL{" "}
              <span className="text-muted-foreground text-xs">
                (concat with the handle)
              </span>
            </Label>
            <Input
              id="base_url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://tiktok.com/@"
              className="font-mono text-xs"
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
                base_url: baseUrl.trim() || null,
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
