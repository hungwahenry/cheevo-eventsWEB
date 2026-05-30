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
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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
  const { form, submit, isSubmitting, previewUrl, pickImage, isEdit } =
    useFeatureForm({
      eventId,
      feature,
      isOpen: open,
      onSuccess: () => onOpenChange(false),
    })
  const inputRef = useRef<HTMLInputElement>(null)
  const description = form.watch("description")
  const errors = form.formState.errors

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit feature" : "Add feature"}</DialogTitle>
          <DialogDescription>
            Highlight something special about your event.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex items-end gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label={previewUrl ? "Change image" : "Upload image"}
              className="group relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted text-muted-foreground hover:bg-muted/70"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt=""
                  className="size-full object-cover transition group-hover:opacity-70"
                />
              ) : null}
              <UploadIcon
                className={`absolute size-4 ${previewUrl ? "text-background opacity-0 transition group-hover:opacity-100" : ""}`}
              />
            </button>
            <Field>
              <FieldLabel htmlFor="feature-title">Title</FieldLabel>
              <Input
                id="feature-title"
                maxLength={EVENT_FEATURE_LIMITS.title}
                placeholder="e.g. Live DJ set"
                {...form.register("title")}
              />
              <FieldError errors={[errors.title]} />
            </Field>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="hidden"
            onChange={(event) => {
              const picked = event.target.files?.[0]
              if (picked) pickImage(picked)
              event.target.value = ""
            }}
          />

          <Field>
            <FieldLabel htmlFor="feature-description">Description</FieldLabel>
            <Textarea
              id="feature-description"
              rows={3}
              maxLength={EVENT_FEATURE_LIMITS.description}
              placeholder="A short detail about this feature."
              {...form.register("description")}
            />
            <FieldCounter
              current={description.length}
              max={EVENT_FEATURE_LIMITS.description}
            />
            <FieldError errors={[errors.description]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="feature-link">Link</FieldLabel>
            <Input
              id="feature-link"
              maxLength={EVENT_FEATURE_LIMITS.link}
              placeholder="https://…"
              {...form.register("link")}
            />
            <FieldError errors={[errors.link]} />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="feature-starts">Starts</FieldLabel>
              <Input
                id="feature-starts"
                type="datetime-local"
                {...form.register("starts_at")}
              />
              <FieldError errors={[errors.starts_at]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="feature-ends">Ends</FieldLabel>
              <Input
                id="feature-ends"
                type="datetime-local"
                {...form.register("ends_at")}
              />
              <FieldError errors={[errors.ends_at]} />
            </Field>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving…"
                : isEdit
                  ? "Save changes"
                  : "Add feature"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
