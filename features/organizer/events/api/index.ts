import type {
  EventFeature,
  EventImage,
  EventItem,
  EventsPage,
  Interest,
  PlaceDetails,
  PlacePrediction,
} from "@/features/organizer/events/types"
import { api } from "@/lib/api"

export function listInterests() {
  return api.get<Interest[]>("/interests")
}

export type EventStatusFilter = "draft" | "published"

export function listEvents(
  page: number,
  perPage = 20,
  status?: EventStatusFilter,
  q?: string
) {
  return api.get<EventsPage>("/organizer/events", {
    params: {
      page,
      per_page: perPage,
      ...(status ? { status } : {}),
      ...(q ? { q } : {}),
    },
  })
}

export function getEvent(id: string) {
  return api.get<EventItem>(`/organizer/events/${id}`)
}

export function createEvent(title: string) {
  return api.post<EventItem>("/organizer/events", { title })
}

export function updateEvent(id: string, data: Record<string, unknown>) {
  return api.patch<EventItem>(`/organizer/events/${id}`, data)
}

export function updateEventFlyer(id: string, flyer: File) {
  const form = new FormData()
  form.append("_method", "PATCH")
  form.append("flyer", flyer)
  return api.post<EventItem>(`/organizer/events/${id}`, form)
}

export function publishEvent(id: string) {
  return api.post<EventItem>(`/organizer/events/${id}/publish`)
}

export function deleteEvent(id: string) {
  return api.delete<null>(`/organizer/events/${id}`)
}

export function addEventImage(eventId: string, image: File) {
  const form = new FormData()
  form.append("image", image)
  return api.post<EventImage>(`/organizer/events/${eventId}/images`, form)
}

export function deleteEventImage(eventId: string, imageId: string) {
  return api.delete<null>(`/organizer/events/${eventId}/images/${imageId}`)
}

export function reorderEventImages(eventId: string, ids: string[]) {
  return api.patch<EventImage[]>(
    `/organizer/events/${eventId}/images/reorder`,
    { ids }
  )
}

export type FeatureInput = {
  title: string
  description?: string
  link?: string
  starts_at?: string
  ends_at?: string
  image?: File | null
}

function featureForm(input: FeatureInput, spoofMethod?: "PATCH"): FormData {
  const form = new FormData()
  if (spoofMethod) form.append("_method", spoofMethod)
  form.append("title", input.title)
  if (input.description) form.append("description", input.description)
  if (input.link) form.append("link", input.link)
  if (input.starts_at) form.append("starts_at", input.starts_at)
  if (input.ends_at) form.append("ends_at", input.ends_at)
  if (input.image) form.append("image", input.image)
  return form
}

export function createEventFeature(eventId: string, input: FeatureInput) {
  return api.post<EventFeature>(
    `/organizer/events/${eventId}/features`,
    featureForm(input)
  )
}

export function updateEventFeature(
  eventId: string,
  featureId: string,
  input: FeatureInput
) {
  return api.post<EventFeature>(
    `/organizer/events/${eventId}/features/${featureId}`,
    featureForm(input, "PATCH")
  )
}

export function deleteEventFeature(eventId: string, featureId: string) {
  return api.delete<null>(`/organizer/events/${eventId}/features/${featureId}`)
}

export function reorderEventFeatures(eventId: string, ids: string[]) {
  return api.patch<EventFeature[]>(
    `/organizer/events/${eventId}/features/reorder`,
    { ids }
  )
}

export function searchPlaces(query: string, sessionToken: string) {
  return api.get<PlacePrediction[]>("/places/search", {
    params: { query, session_token: sessionToken },
  })
}

export function getPlaceDetails(placeId: string, sessionToken: string) {
  return api.get<PlaceDetails>(`/places/${encodeURIComponent(placeId)}`, {
    params: { session_token: sessionToken },
  })
}
