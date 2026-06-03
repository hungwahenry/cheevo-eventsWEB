import type {
  AdminEvent,
  AdminEventStatus,
  AdminEventsPage,
} from "@/features/admin/events/types"
import { api } from "@/lib/api"

export type ListEventsFilters = {
  q?: string
  status?: AdminEventStatus
  organisation_id?: string
  from?: string
  to?: string
  has_sales?: boolean
  per_page?: number
  page?: number
}

export function listEvents(
  filters: ListEventsFilters = {}
): Promise<AdminEventsPage> {
  return api.get<AdminEventsPage>("/admin/events", { params: filters })
}

export function getEvent(id: string): Promise<AdminEvent> {
  return api.get<AdminEvent>(`/admin/events/${id}`)
}

export function unpublishEvent(id: string): Promise<AdminEvent> {
  return api.post<AdminEvent>(`/admin/events/${id}/unpublish`)
}

export function markEventPast(id: string): Promise<AdminEvent> {
  return api.post<AdminEvent>(`/admin/events/${id}/mark-past`)
}

export function lockEventComments(
  id: string,
  reason?: string
): Promise<AdminEvent> {
  return api.post<AdminEvent>(`/admin/events/${id}/lock-comments`, { reason })
}

export function unlockEventComments(id: string): Promise<AdminEvent> {
  return api.post<AdminEvent>(`/admin/events/${id}/unlock-comments`)
}

export function deleteEvent(id: string, reason: string): Promise<void> {
  return api.delete<void>(`/admin/events/${id}`, { data: { reason } })
}
