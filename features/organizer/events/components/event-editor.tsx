"use client"

import { DetailsSection } from "@/features/organizer/events/components/editor/details-section"
import { EventEditorHeader } from "@/features/organizer/events/components/editor/event-editor-header"
import { FeaturesSection } from "@/features/organizer/events/components/editor/features-section"
import { FlyerSection } from "@/features/organizer/events/components/editor/flyer-section"
import { GallerySection } from "@/features/organizer/events/components/editor/gallery-section"
import { PublishErrors } from "@/features/organizer/events/components/editor/publish-errors"
import {
  usePublishEvent,
  useUpdateEvent,
} from "@/features/organizer/events/hooks"
import type { EventItem, PlaceDetails } from "@/features/organizer/events/types"
import { isApiError } from "@/lib/api"
import { useState } from "react"

function toLocalInput(iso: string | null): string {
  if (!iso) return ""
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

type FormState = {
  title: string
  description: string
  starts_at: string
  ends_at: string
  venue_name: string
  video_url: string
  place_id: string
  address: string
  latitude: string
  longitude: string
  city: string
}

export function EventEditor({ event }: { event: EventItem }) {
  const update = useUpdateEvent(event.id)
  const publish = usePublishEvent(event.id)

  const [form, setForm] = useState<FormState>({
    title: event.title,
    description: event.description ?? "",
    starts_at: toLocalInput(event.starts_at),
    ends_at: toLocalInput(event.ends_at),
    venue_name: event.venue_name ?? "",
    video_url: event.video_url ?? "",
    place_id: event.place_id ?? "",
    address: event.address ?? "",
    latitude: event.latitude ?? "",
    longitude: event.longitude ?? "",
    city: event.city ?? "",
  })

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const applyPlace = (place: PlaceDetails) => {
    setForm((prev) => ({
      ...prev,
      place_id: place.place_id,
      address: place.address ?? "",
      latitude: place.latitude !== null ? String(place.latitude) : "",
      longitude: place.longitude !== null ? String(place.longitude) : "",
      city: place.city ?? "",
      venue_name: prev.venue_name || (place.name ?? ""),
    }))
  }

  const save = () =>
    update.mutate({
      title: form.title,
      description: form.description || null,
      starts_at: form.starts_at || null,
      ends_at: form.ends_at || null,
      venue_name: form.venue_name || null,
      video_url: form.video_url || null,
      place_id: form.place_id || null,
      address: form.address || null,
      latitude: form.latitude || null,
      longitude: form.longitude || null,
      city: form.city || null,
    })

  const publishErrors =
    publish.error && isApiError(publish.error) && publish.error.isValidation
      ? Object.values(publish.error.fieldErrors())
      : []

  return (
    <div className="flex flex-col">
      <EventEditorHeader
        event={event}
        onSave={save}
        onPublish={() => publish.mutate()}
        isSaving={update.isPending}
        isPublishing={publish.isPending}
      />

      <PublishErrors errors={publishErrors} />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
        <aside className="order-1 flex flex-col gap-6 lg:sticky lg:top-16 lg:order-2 lg:col-span-1 lg:self-start">
          <FlyerSection event={event} />
        </aside>

        <div className="order-2 flex flex-col gap-10 lg:order-1 lg:col-span-2">
          <DetailsSection form={form} onChange={set} onPlace={applyPlace} />
          <GallerySection event={event} />
          <FeaturesSection />
        </div>
      </div>
    </div>
  )
}
