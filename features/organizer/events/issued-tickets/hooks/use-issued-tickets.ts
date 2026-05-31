import {
  getIssuedTicket,
  listIssuedTickets,
  revokeIssuedTicket,
} from "@/features/organizer/events/issued-tickets/api"
import type { IssuedTicketStatus } from "@/features/organizer/events/issued-tickets/types"
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

export const issuedTicketsKey = (
  eventId: string,
  page: number,
  status?: IssuedTicketStatus,
  q?: string
) =>
  [
    "organizer-event-issued-tickets",
    eventId,
    page,
    status ?? "all",
    q?.trim() ?? "",
  ] as const

export const issuedTicketKey = (eventId: string, ticketId: string) =>
  ["organizer-event-issued-ticket", eventId, ticketId] as const

export function useIssuedTickets(
  eventId: string,
  page: number,
  status?: IssuedTicketStatus,
  q?: string
) {
  return useQuery({
    queryKey: issuedTicketsKey(eventId, page, status, q),
    queryFn: () => listIssuedTickets(eventId, page, 25, status, q),
    placeholderData: keepPreviousData,
  })
}

export function useIssuedTicket(eventId: string, ticketId: string) {
  return useQuery({
    queryKey: issuedTicketKey(eventId, ticketId),
    queryFn: () => getIssuedTicket(eventId, ticketId),
  })
}

export function useRevokeIssuedTicket(eventId: string, ticketId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => revokeIssuedTicket(eventId, ticketId),
    onSuccess: () => {
      toast.success("Ticket revoked.")
      queryClient.invalidateQueries({
        queryKey: issuedTicketKey(eventId, ticketId),
      })
      queryClient.invalidateQueries({
        queryKey: ["organizer-event-issued-tickets", eventId],
      })
    },
  })
}
