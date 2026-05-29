import * as eventsApi from "@/features/organizer/events/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const eventsKey = ["organizer", "events"] as const
export const eventKey = (id: string) => ["organizer", "event", id] as const

export function useEvents() {
  return useQuery({ queryKey: eventsKey, queryFn: eventsApi.listEvents })
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
