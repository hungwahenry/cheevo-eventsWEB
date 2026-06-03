import * as api from "@/features/admin/events/api"
import { useQuery } from "@tanstack/react-query"

export const eventsListKey = (filters: api.ListEventsFilters) =>
  ["admin", "events", filters] as const

export const eventKey = (id: string) => ["admin", "event", id] as const

export function useEvents(filters: api.ListEventsFilters = {}) {
  return useQuery({
    queryKey: eventsListKey(filters),
    queryFn: () => api.listEvents(filters),
    staleTime: 10_000,
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKey(id),
    queryFn: () => api.getEvent(id),
    enabled: Boolean(id),
  })
}
