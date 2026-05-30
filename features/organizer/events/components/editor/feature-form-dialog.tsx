"use client"

import { FieldCounter } from "@/components/field-counter"
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
import { useFeatureForm } from "@/features/organizer/events/hooks"
import { EVENT_FEATURE_LIMITS } from "@/features/organizer/events/limits"
import type { EventFeature } from "@/features/organizer/events/types"
import { UploadIcon } from "lucide-react"
import { useRef } from "react"

const ACCEPTED = "image/jpeg,image/png,image/webp"

type FeatureFormDialogProps = {
  eventId: string
  feature: EventFeature | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeatureFormDialog({
  eventId,
  feature,
  open,
  onOpenChange,
}: FeatureFormDialogProps) {
  const form = useFeatureForm({
    eventId,
    feature,
    isOpen: open,
    onSuccess: () => onOpenChange(false),
  })
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {form.isEdit ? "Edit feature" : "Add feature"}
          </DialogTitle>
          <DialogDescription>
            Highlight something special about your event.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label={form.previewUrl ? "Change image" : "Upload image"}
              className="group relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted text-muted-foreground hover:bg-muted/70"
            >
              {form.previewUrl ? (
                <img
                  src={form.previewUrl}
                  alt=""
                  className="size-full object-cover transition group-hover:opacity-70"
                />
              ) : null}
              <UploadIcon
                className={`absolute size-4 ${form.previewUrl ? "text-background opacity-0 transition group-hover:opacity-100" : ""}`}
              />
            </button>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="feature-title">Title</Label>
              <Input
                id="feature-title"
                value={form.form.title}
                maxLength={EVENT_FEATURE_LIMITS.title}
                onChange={(event) => form.set("title", event.target.value)}
                placeholder="e.g. Live DJ set"
              />
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="hidden"
            onChange={(event) => {
              const picked = event.target.files?.[0]
              if (picked) form.pickImage(picked)
              event.target.value = ""
            }}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="feature-description">Description</Label>
            <Textarea
              id="feature-description"
              rows={3}
              value={form.form.description}
              maxLength={EVENT_FEATURE_LIMITS.description}
              onChange={(event) => form.set("description", event.target.value)}
              placeholder="A short detail about this feature."
            />
            <FieldCounter
              current={form.form.description.length}
              max={EVENT_FEATURE_LIMITS.description}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="feature-link">Link</Label>
            <Input
              id="feature-link"
              value={form.form.link}
              maxLength={EVENT_FEATURE_LIMITS.link}
              onChange={(event) => form.set("link", event.target.value)}
              placeholder="https://…"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="feature-starts">Starts</Label>
              <Input
                id="feature-starts"
                type="datetime-local"
                value={form.form.starts_at}
                onChange={(event) => form.set("starts_at", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="feature-ends">Ends</Label>
              <Input
                id="feature-ends"
                type="datetime-local"
                value={form.form.ends_at}
                onChange={(event) => form.set("ends_at", event.target.value)}
              />
            </div>
          </div>

          {form.errorMessage ? (
            <p className="text-sm text-destructive">{form.errorMessage}</p>
          ) : null}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={form.submit}
            disabled={!form.canSubmit}
          >
            {form.isSubmitting
              ? "Saving…"
              : form.isEdit
                ? "Save changes"
                : "Add feature"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
