import type {
  Broadcast,
  BroadcastsPage,
  CreateBroadcastPayload,
} from "@/features/organizer/events/broadcasts/types"
import { api } from "@/lib/api"

export function listEventBroadcasts(
  eventId: string,
  page: number,
  perPage = 20
): Promise<BroadcastsPage> {
  return api.get<BroadcastsPage>(`/organizer/events/${eventId}/broadcasts`, {
    params: { page, per_page: perPage },
  })
}

export function createBroadcast(
  eventId: string,
  payload: CreateBroadcastPayload
): Promise<Broadcast> {
  return api.post<Broadcast>(
    `/organizer/events/${eventId}/broadcasts`,
    payload
  )
}
