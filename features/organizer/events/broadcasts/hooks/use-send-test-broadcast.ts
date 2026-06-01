import { sendTestBroadcast } from "@/features/organizer/events/broadcasts/api"
import type { CreateBroadcastPayload } from "@/features/organizer/events/broadcasts/types"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function useSendTestBroadcast(eventId: string) {
  return useMutation({
    mutationFn: (payload: CreateBroadcastPayload) =>
      sendTestBroadcast(eventId, payload),
    onSuccess: () => {
      toast.success("Test sent. Check your inbox.")
    },
  })
}
