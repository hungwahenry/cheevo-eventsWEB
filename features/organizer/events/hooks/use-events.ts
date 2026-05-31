import * as eventsApi from "@/features/organizer/events/api"
import type { EventStatusFilter } from "@/features/organizer/events/api"
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const eventsKey = ["organizer", "events"] as const

export const eventsPageKey = (
  page: number,
  status?: EventStatusFilter,
  q?: string
) =>
  [...eventsKey, page, status ?? "all", q?.trim() ?? ""] as const

export const eventKey = (id: string) => ["organizer", "event", id] as const

export function useEvents(
  page: number,
  status?: EventStatusFilter,
  q?: string
) {
  return useQuery({
    queryKey: eventsPageKey(page, status, q),
    queryFn: () => eventsApi.listEvents(page, 20, status, q),
    placeholderData: keepPreviousData,
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKey(id),
    queryFn: () => eventsApi.getEvent(id),
  })
}

export function useCreateEvent() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (title: string) => eventsApi.createEvent(title),
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: eventsKey })
      router.push(`/organizer/events/${event.id}/edit`)
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => eventsApi.deleteEvent(id),
    onSuccess: () => {
      toast.success("Event deleted.")
      queryClient.invalidateQueries({ queryKey: eventsKey })
    },
  })
}
