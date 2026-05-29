"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DetailsSection } from "@/features/organizer/events/components/editor/details-section"
import { EventEditorHeader } from "@/features/organizer/events/components/editor/event-editor-header"
import { FeaturesSection } from "@/features/organizer/events/components/editor/features-section"
import { FlyerSection } from "@/features/organizer/events/components/editor/flyer-section"
import { GallerySection } from "@/features/organizer/events/components/editor/gallery-section"
import { PublishErrors } from "@/features/organizer/events/components/editor/publish-errors"
import { TicketsSection } from "@/features/organizer/events/tickets/components/tickets-section"
import {
  usePublishEvent,
  useUpdateEvent,
} from "@/features/organizer/events/hooks"
import type { EventItem, PlaceDetails } from "@/features/organizer/events/types"
import { isApiError } from "@/lib/api"
import { toLocalInputValue } from "@/lib/format/datetime"
import { useState } from "react"

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
  const [confirmOpen, setConfirmOpen] = useState(false)

  const requestPublish = () => {
    if (event.tickets_count === 0) {
      setConfirmOpen(true)
      return
    }
    publish.mutate()
  }

  const confirmPublish = () => {
    setConfirmOpen(false)
    publish.mutate()
  }

  const [form, setForm] = useState<FormState>({
    title: event.title,
    description: event.description ?? "",
    starts_at: toLocalInputValue(event.starts_at),
    ends_at: toLocalInputValue(event.ends_at),
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
        onPublish={requestPublish}
        isSaving={update.isPending}
        isPublishing={publish.isPending}
      />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish without any tickets?</AlertDialogTitle>
            <AlertDialogDescription>
              Attendees won&apos;t be able to buy in until you add at least one
              ticket. You can publish now and add tickets later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Add a ticket first</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPublish}>
              Publish anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PublishErrors errors={publishErrors} />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
        <aside className="order-1 flex flex-col gap-6 lg:sticky lg:top-16 lg:order-2 lg:col-span-1 lg:self-start">
          <FlyerSection event={event} />
        </aside>

        <div className="order-2 flex flex-col gap-10 lg:order-1 lg:col-span-2">
          <DetailsSection form={form} onChange={set} onPlace={applyPlace} />
          <TicketsSection event={event} />
          <GallerySection event={event} />
          <FeaturesSection event={event} />
        </div>
      </div>
    </div>
  )
}
