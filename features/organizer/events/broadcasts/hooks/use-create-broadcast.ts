import { createBroadcast } from "@/features/organizer/events/broadcasts/api"
import type { CreateBroadcastPayload } from "@/features/organizer/events/broadcasts/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateBroadcast(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBroadcastPayload) =>
      createBroadcast(eventId, payload),
    onSuccess: () => {
      toast.success("Broadcast queued.")
      queryClient.invalidateQueries({
        queryKey: ["organizer-event-broadcasts", eventId],
      })
    },
  })
}
