import type {
  BroadcastAnnouncementPayload,
  BroadcastAnnouncementResult,
  ExpoTokenHealth,
} from "@/features/admin/notifications/types"
import { api } from "@/lib/api"

export function broadcastAnnouncement(
  payload: BroadcastAnnouncementPayload
): Promise<BroadcastAnnouncementResult> {
  return api.post<BroadcastAnnouncementResult>(
    "/admin/notifications/broadcast",
    payload
  )
}

export function getExpoTokenHealth(): Promise<ExpoTokenHealth> {
  return api.get<ExpoTokenHealth>("/admin/notifications/expo-tokens")
}
