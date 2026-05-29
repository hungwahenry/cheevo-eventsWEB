import * as eventsApi from "@/features/organizer/events/api"
import { useQuery } from "@tanstack/react-query"

export const interestsKey = ["interests"] as const

export function useInterests() {
  return useQuery({
    queryKey: interestsKey,
    queryFn: () => eventsApi.listInterests(),
    // Reference data — rarely changes.
    staleTime: 60 * 60 * 1000,
  })
}
