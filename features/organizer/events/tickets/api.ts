import type {
  EventTicket,
  TicketInput,
} from "@/features/organizer/events/tickets/types"
import { api } from "@/lib/api"

export function createEventTicket(eventId: string, input: TicketInput) {
  return api.post<EventTicket>(`/organizer/events/${eventId}/tickets`, input)
}

export function updateEventTicket(
  eventId: string,
  ticketId: string,
  input: TicketInput
) {
  return api.patch<EventTicket>(
    `/organizer/events/${eventId}/tickets/${ticketId}`,
    input
  )
}

export function deleteEventTicket(eventId: string, ticketId: string) {
  return api.delete<null>(`/organizer/events/${eventId}/tickets/${ticketId}`)
}

export function reorderEventTickets(eventId: string, ids: string[]) {
  return api.patch<EventTicket[]>(
    `/organizer/events/${eventId}/tickets/reorder`,
    { ids }
  )
}
