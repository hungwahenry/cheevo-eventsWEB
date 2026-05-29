import * as eventsApi from "@/features/organizer/events/api"
import { eventKey } from "@/features/organizer/events/hooks/use-events"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useAddEventImage(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (image: File) => eventsApi.addEventImage(eventId, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKey(eventId) })
    },
    onError: () => {
      toast.error("Upload failed.")
    },
  })
}

export function useDeleteEventImage(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (imageId: string) =>
      eventsApi.deleteEventImage(eventId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKey(eventId) })
    },
    onError: () => {
      toast.error("Delete failed.")
    },
  })
}

export function useReorderEventImages(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => eventsApi.reorderEventImages(eventId, ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKey(eventId) })
    },
    onError: () => {
      toast.error("Reorder failed.")
      queryClient.invalidateQueries({ queryKey: eventKey(eventId) })
    },
  })
}
