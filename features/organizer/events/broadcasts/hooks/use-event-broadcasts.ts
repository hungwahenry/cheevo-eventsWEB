import { listEventBroadcasts } from "@/features/organizer/events/broadcasts/api"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const broadcastsKey = (eventId: string, page: number) =>
  ["organizer-event-broadcasts", eventId, page] as const

export function useEventBroadcasts(eventId: string, page: number) {
  return useQuery({
    queryKey: broadcastsKey(eventId, page),
    queryFn: () => listEventBroadcasts(eventId, page),
    placeholderData: keepPreviousData,
  })
}
