import type {
  IssuedTicket,
  IssuedTicketStatus,
  IssuedTicketsPage,
} from "@/features/organizer/events/issued-tickets/types"
import { api } from "@/lib/api"

export function listIssuedTickets(
  eventId: string,
  page: number,
  perPage = 25,
  status?: IssuedTicketStatus,
  q?: string
): Promise<IssuedTicketsPage> {
  return api.get<IssuedTicketsPage>(
    `/organizer/events/${eventId}/issued-tickets`,
    {
      params: {
        page,
        per_page: perPage,
        ...(status ? { status } : {}),
        ...(q ? { q } : {}),
      },
    }
  )
}

export function getIssuedTicket(
  eventId: string,
  ticketId: string
): Promise<IssuedTicket> {
  return api.get<IssuedTicket>(
    `/organizer/events/${eventId}/issued-tickets/${ticketId}`
  )
}

export function revokeIssuedTicket(
  eventId: string,
  ticketId: string
): Promise<IssuedTicket> {
  return api.post<IssuedTicket>(
    `/organizer/events/${eventId}/issued-tickets/${ticketId}/revoke`,
    {}
  )
}
