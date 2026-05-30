"use client"

import { FieldCounter } from "@/components/field-counter"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LocationSection } from "@/features/organizer/events/components/editor/location-section"
import { EVENT_LIMITS } from "@/features/organizer/events/limits"
import type { PlaceDetails } from "@/features/organizer/events/types"

export type DetailsFormFields = {
  title: string
  description: string
  starts_at: string
  ends_at: string
  venue_name: string
  video_url: string
  address: string
}

type DetailsSectionProps = {
  form: DetailsFormFields
  onChange: (key: keyof DetailsFormFields, value: string) => void
  onPlace: (place: PlaceDetails) => void
}

export function DetailsSection({
  form,
  onChange,
  onPlace,
}: DetailsSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-medium">Details</h2>

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={form.title}
          maxLength={EVENT_LIMITS.title}
          onChange={(event) => onChange("title", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={form.description}
          maxLength={EVENT_LIMITS.description}
          onChange={(event) => onChange("description", event.target.value)}
          placeholder="What's the event about?"
        />
        <FieldCounter current={form.description.length} max={EVENT_LIMITS.description} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="starts_at">Starts</Label>
          <Input
            id="starts_at"
            type="datetime-local"
            value={form.starts_at}
            onChange={(event) => onChange("starts_at", event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="ends_at">Ends</Label>
          <Input
            id="ends_at"
            type="datetime-local"
            value={form.ends_at}
            onChange={(event) => onChange("ends_at", event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LocationSection
          currentAddress={form.address || null}
          onResolved={onPlace}
        />
        <div className="flex flex-col gap-2">
          <Label htmlFor="venue_name">Venue name</Label>
          <Input
            id="venue_name"
            value={form.venue_name}
            maxLength={EVENT_LIMITS.venueName}
            onChange={(event) => onChange("venue_name", event.target.value)}
            placeholder="e.g. Eko Hotel"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="video_url">Promo video URL</Label>
        <Input
          id="video_url"
          value={form.video_url}
          maxLength={EVENT_LIMITS.videoUrl}
          onChange={(event) => onChange("video_url", event.target.value)}
          placeholder="https://… (YouTube, IG, TikTok)"
        />
      </div>
    </section>
  )
}
