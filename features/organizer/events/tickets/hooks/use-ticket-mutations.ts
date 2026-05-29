import { eventKey } from "@/features/organizer/events/hooks/use-events"
import * as ticketsApi from "@/features/organizer/events/tickets/api"
import type { TicketInput } from "@/features/organizer/events/tickets/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateTicket(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: TicketInput) =>
      ticketsApi.createEventTicket(eventId, input),
    onSuccess: () => {
      toast.success("Ticket added.")
      queryClient.invalidateQueries({ queryKey: eventKey(eventId) })
    },
  })
}

export function useUpdateTicket(eventId: string, ticketId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: TicketInput) =>
      ticketsApi.updateEventTicket(eventId, ticketId, input),
    onSuccess: () => {
      toast.success("Ticket updated.")
      queryClient.invalidateQueries({ queryKey: eventKey(eventId) })
    },
  })
}

export function useDeleteTicket(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ticketId: string) =>
      ticketsApi.deleteEventTicket(eventId, ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKey(eventId) })
    },
    onError: () => {
      toast.error("Delete failed.")
    },
  })
}

export function useReorderTickets(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => ticketsApi.reorderEventTickets(eventId, ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKey(eventId) })
    },
    onError: () => {
      toast.error("Reorder failed.")
      queryClient.invalidateQueries({ queryKey: eventKey(eventId) })
    },
  })
}
