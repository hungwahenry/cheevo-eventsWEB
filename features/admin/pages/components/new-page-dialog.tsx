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
import { useCreatePage } from "@/features/admin/pages/hooks"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Optional default title to seed the form (used by empty-state starter buttons). */
  defaultTitle?: string
}

export function NewPageDialog({ open, onOpenChange, defaultTitle }: Props) {
  const router = useRouter()
  const create = useCreatePage()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (open) {
      setTitle(defaultTitle ?? "")
      setSlug(defaultTitle ? slugify(defaultTitle) : "")
      setSlugTouched(false)
    }
  }, [open, defaultTitle])

  // Auto-derive slug from title until the user manually edits the slug field.
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title))
  }, [title, slugTouched])

  const canSubmit = title.trim().length > 0 && slug.length > 0 && !create.isPending

  const submit = () => {
    create.mutate(
      {
        slug,
        title: title.trim(),
        body_html: "<p></p>",
      },
      {
        onSuccess: (created) => {
          onOpenChange(false)
          router.push(`/admin/pages/${created.id}`)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New page</DialogTitle>
          <DialogDescription>
            Drafts start unpublished. You can edit and publish anytime.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Terms of Service"
              autoFocus
              maxLength={200}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit) {
                  e.preventDefault()
                  submit()
                }
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">URL slug</Label>
            <div className="border-input bg-background focus-within:border-ring focus-within:ring-ring/20 flex items-center overflow-hidden rounded-md border focus-within:ring-2">
              <span className="text-muted-foreground bg-muted/40 border-input border-r px-2 py-2 font-mono text-xs">
                /
              </span>
              <input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  setSlug(slugify(e.target.value))
                }}
                placeholder="terms-of-service"
                maxLength={80}
                className="placeholder:text-muted-foreground flex-1 bg-transparent px-3 py-2 font-mono text-xs outline-none"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!canSubmit} onClick={submit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}
