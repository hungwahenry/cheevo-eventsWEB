"use client"

import { FieldCounter } from "@/components/field-counter"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LocationSection } from "@/features/organizer/events/components/editor/location-section"
import { EVENT_LIMITS } from "@/features/organizer/events/limits"
import type { PlaceDetails } from "@/features/organizer/events/types"
import type { EventInput } from "@/features/organizer/events/validation"
import type { UseFormReturn } from "react-hook-form"

type DetailsSectionProps = {
  form: UseFormReturn<EventInput>
  onPlace: (place: PlaceDetails) => void
}

export function DetailsSection({ form, onPlace }: DetailsSectionProps) {
  const description = form.watch("description")
  const address = form.watch("address")
  const errors = form.formState.errors

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-medium">Details</h2>

      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input
          id="title"
          maxLength={EVENT_LIMITS.title}
          aria-invalid={!!errors.title}
          {...form.register("title")}
        />
        <FieldError errors={[errors.title]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          rows={4}
          maxLength={EVENT_LIMITS.description}
          placeholder="What's the event about?"
          aria-invalid={!!errors.description}
          {...form.register("description")}
        />
        <FieldCounter
          current={description.length}
          max={EVENT_LIMITS.description}
        />
        <FieldError errors={[errors.description]} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="starts_at">Starts</FieldLabel>
          <Input
            id="starts_at"
            type="datetime-local"
            aria-invalid={!!errors.starts_at}
            {...form.register("starts_at")}
          />
          <FieldError errors={[errors.starts_at]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="ends_at">Ends</FieldLabel>
          <Input
            id="ends_at"
            type="datetime-local"
            aria-invalid={!!errors.ends_at}
            {...form.register("ends_at")}
          />
          <FieldError errors={[errors.ends_at]} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LocationSection
          currentAddress={address || null}
          onResolved={onPlace}
        />
        <Field>
          <FieldLabel htmlFor="venue_name">Venue name</FieldLabel>
          <Input
            id="venue_name"
            maxLength={EVENT_LIMITS.venueName}
            placeholder="e.g. Eko Hotel"
            aria-invalid={!!errors.venue_name}
            {...form.register("venue_name")}
          />
          <FieldError errors={[errors.venue_name]} />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="video_url">Promo video URL</FieldLabel>
        <Input
          id="video_url"
          maxLength={EVENT_LIMITS.videoUrl}
          placeholder="https://… (YouTube, IG, TikTok)"
          aria-invalid={!!errors.video_url}
          {...form.register("video_url")}
        />
        <FieldError errors={[errors.video_url]} />
      </Field>
    </section>
  )
}
