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
import { InterestsSection } from "@/features/organizer/events/components/editor/interests-section"
import { PublishErrors } from "@/features/organizer/events/components/editor/publish-errors"
import { TicketsSection } from "@/features/organizer/events/tickets/components/tickets-section"
import {
  usePublishEvent,
  useUpdateEvent,
} from "@/features/organizer/events/hooks"
import type { EventItem, PlaceDetails } from "@/features/organizer/events/types"
import type { EventInput } from "@/features/organizer/events/validation"
import { eventSchema } from "@/features/organizer/events/validation"
import { applyApiErrors, isApiError } from "@/lib/api"
import { toLocalInputValue } from "@/lib/format/datetime"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const FORM_FIELDS = [
  "title",
  "description",
  "starts_at",
  "ends_at",
  "presale_until",
  "venue_name",
  "address",
  "city",
  "video_url",
  "interests",
] as const

type FormFieldName = (typeof FORM_FIELDS)[number]

function defaults(event: EventItem): EventInput {
  return {
    title: event.title,
    description: event.description ?? "",
    starts_at: toLocalInputValue(event.starts_at),
    ends_at: toLocalInputValue(event.ends_at),
    presale_until: toLocalInputValue(event.presale_until),
    venue_name: event.venue_name ?? "",
    video_url: event.video_url ?? "",
    place_id: event.place_id ?? "",
    address: event.address ?? "",
    latitude: event.latitude ?? "",
    longitude: event.longitude ?? "",
    city: event.city ?? "",
    interests: event.interests?.map((i) => i.slug) ?? [],
  }
}

function EventEndedBanner() {
  return (
    <div className="bg-muted text-muted-foreground mt-4 rounded-lg border px-4 py-3 text-sm">
      This event has ended — its details, tickets, gallery, features, and
      broadcasts are read-only.
    </div>
  )
}

export function EventEditor({ event }: { event: EventItem }) {
  const update = useUpdateEvent(event.id)
  const publish = usePublishEvent(event.id)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const form = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: defaults(event),
  })

  const save = form.handleSubmit(async (values) => {
    try {
      await update.mutateAsync({
        title: values.title.trim(),
        description: values.description.trim() || null,
        starts_at: values.starts_at || null,
        ends_at: values.ends_at || null,
        presale_until: values.presale_until || null,
        venue_name: values.venue_name.trim() || null,
        video_url: values.video_url || null,
        place_id: values.place_id || null,
        address: values.address || null,
        latitude: values.latitude || null,
        longitude: values.longitude || null,
        city: values.city || null,
        interests: values.interests,
      })
    } catch (error) {
      applyApiErrors(form, error)
    }
  })

  const applyPlace = (place: PlaceDetails) => {
    form.setValue("place_id", place.place_id, { shouldDirty: true })
    form.setValue("address", place.address ?? "", { shouldDirty: true })
    form.setValue(
      "latitude",
      place.latitude !== null ? String(place.latitude) : "",
      { shouldDirty: true }
    )
    form.setValue(
      "longitude",
      place.longitude !== null ? String(place.longitude) : "",
      { shouldDirty: true }
    )
    form.setValue("city", place.city ?? "", { shouldDirty: true })
    if (!form.getValues("venue_name") && place.name) {
      form.setValue("venue_name", place.name, { shouldDirty: true })
    }
  }

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

  useEffect(() => {
    if (!isApiError(publish.error) || !publish.error.isValidation) return
    for (const [key, message] of Object.entries(publish.error.fieldErrors())) {
      if ((FORM_FIELDS as readonly string[]).includes(key)) {
        form.setError(key as FormFieldName, { type: "server", message })
      } else if (key === "location") {
        form.setError("venue_name", { type: "server", message })
      }
    }
  }, [publish.error, form])

  const publishErrors = (() => {
    if (!isApiError(publish.error)) return []
    if (!publish.error.isValidation) return [publish.error.message]
    return Object.entries(publish.error.fieldErrors())
      .filter(
        ([key]) =>
          !(FORM_FIELDS as readonly string[]).includes(key) && key !== "location"
      )
      .map(([, message]) => message)
  })()

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

      {event.status === "past" ? <EventEndedBanner /> : null}

      <fieldset
        disabled={event.status === "past"}
        className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10"
      >
        <aside className="order-1 flex flex-col gap-6 lg:sticky lg:top-16 lg:order-2 lg:col-span-1 lg:self-start">
          <FlyerSection event={event} />
        </aside>

        <div className="order-2 flex flex-col gap-10 lg:order-1 lg:col-span-2">
          <DetailsSection form={form} onPlace={applyPlace} />
          <InterestsSection form={form} />
          <TicketsSection event={event} />
          <GallerySection event={event} />
          <FeaturesSection event={event} />
        </div>
      </fieldset>
    </div>
  )
}
