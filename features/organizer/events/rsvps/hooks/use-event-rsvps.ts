import { listEventRsvps } from "@/features/organizer/events/rsvps/api"
import { useInfiniteQuery } from "@tanstack/react-query"

export const rsvpsKey = (eventId: string) =>
  ["organizer-event-rsvps", eventId] as const

export function useEventRsvps(eventId: string) {
  return useInfiniteQuery({
    queryKey: rsvpsKey(eventId),
    queryFn: ({ pageParam }) => listEventRsvps(eventId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.last_page ? last.page + 1 : undefined,
  })
}
