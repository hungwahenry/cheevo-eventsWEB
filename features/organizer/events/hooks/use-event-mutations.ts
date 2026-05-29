import * as eventsApi from "@/features/organizer/events/api"
import {
  eventKey,
  eventsKey,
} from "@/features/organizer/events/hooks/use-events"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      eventsApi.updateEvent(id, data),
    onSuccess: () => {
      toast.success("Saved.")
      queryClient.invalidateQueries({ queryKey: eventKey(id) })
      queryClient.invalidateQueries({ queryKey: eventsKey })
    },
  })
}

export function usePublishEvent(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => eventsApi.publishEvent(id),
    onSuccess: () => {
      toast.success("Event published.")
      queryClient.invalidateQueries({ queryKey: eventKey(id) })
      queryClient.invalidateQueries({ queryKey: eventsKey })
    },
  })
}
