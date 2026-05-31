import type { RsvpsPage } from "@/features/organizer/events/rsvps/types"
import { api } from "@/lib/api"

export function listEventRsvps(
  eventId: string,
  page: number,
  perPage = 20
): Promise<RsvpsPage> {
  return api.get<RsvpsPage>(`/organizer/events/${eventId}/rsvps`, {
    params: { page, per_page: perPage },
  })
}
