import { listEventRsvps } from "@/features/organizer/events/rsvps/api"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const rsvpsKey = (eventId: string, page: number) =>
  ["organizer-event-rsvps", eventId, page] as const

export function useEventRsvps(eventId: string, page: number) {
  return useQuery({
    queryKey: rsvpsKey(eventId, page),
    queryFn: () => listEventRsvps(eventId, page),
    placeholderData: keepPreviousData,
  })
}
