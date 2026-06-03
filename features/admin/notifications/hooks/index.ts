import * as api from "@/features/admin/notifications/api"
import type {
  BroadcastAnnouncementPayload,
  BroadcastAnnouncementResult,
} from "@/features/admin/notifications/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export function useExpoTokenHealth() {
  return useQuery({
    queryKey: ["admin", "expo-token-health"] as const,
    queryFn: () => api.getExpoTokenHealth(),
    staleTime: 60_000,
  })
}

export function useBroadcastAnnouncement() {
  return useMutation({
    mutationFn: (payload: BroadcastAnnouncementPayload) =>
      api.broadcastAnnouncement(payload),
    onSuccess: (result: BroadcastAnnouncementResult) => {
      toast.success(
        `Announcement queued — ${result.recipients} recipient(s), ${result.chunks} batch(es).`
      )
    },
    onError: (error: unknown) => {
      toast.error(
        isApiError(error) ? error.message : "Couldn't queue the announcement."
      )
    },
  })
}
