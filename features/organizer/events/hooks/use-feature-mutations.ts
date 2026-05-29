import * as eventsApi from "@/features/organizer/events/api"
import type { FeatureInput } from "@/features/organizer/events/api"
import { eventKey } from "@/features/organizer/events/hooks/use-events"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateEventFeature(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: FeatureInput) =>
      eventsApi.createEventFeature(eventId, input),
    onSuccess: () => {
      toast.success("Feature added.")
      queryClient.invalidateQueries({ queryKey: eventKey(eventId) })
    },
  })
}

export function useUpdateEventFeature(eventId: string, featureId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: FeatureInput) =>
      eventsApi.updateEventFeature(eventId, featureId, input),
    onSuccess: () => {
      toast.success("Feature updated.")
      queryClient.invalidateQueries({ queryKey: eventKey(eventId) })
    },
  })
}

export function useDeleteEventFeature(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (featureId: string) =>
      eventsApi.deleteEventFeature(eventId, featureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKey(eventId) })
    },
    onError: () => {
      toast.error("Delete failed.")
    },
  })
}

export function useReorderEventFeatures(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => eventsApi.reorderEventFeatures(eventId, ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKey(eventId) })
    },
    onError: () => {
      toast.error("Reorder failed.")
      queryClient.invalidateQueries({ queryKey: eventKey(eventId) })
    },
  })
}
