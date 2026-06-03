import type {
  AdminIssuedTicket,
  AdminIssuedTicketStatus,
  AdminIssuedTicketsPage,
} from "@/features/admin/issued-tickets/types"
import { api } from "@/lib/api"

export type ListIssuedTicketsFilters = {
  q?: string
  status?: AdminIssuedTicketStatus
  event_id?: string
  holder_user_id?: string
  per_page?: number
  page?: number
}

export function listIssuedTickets(
  filters: ListIssuedTicketsFilters = {}
): Promise<AdminIssuedTicketsPage> {
  return api.get<AdminIssuedTicketsPage>("/admin/issued-tickets", {
    params: filters,
  })
}

export function revokeIssuedTicket(
  id: string,
  reason: string
): Promise<AdminIssuedTicket> {
  return api.post<AdminIssuedTicket>(`/admin/issued-tickets/${id}/revoke`, {
    reason,
  })
}

export function reissueIssuedTicket(id: string): Promise<AdminIssuedTicket> {
  return api.post<AdminIssuedTicket>(`/admin/issued-tickets/${id}/reissue`)
}

export function transferIssuedTicket(
  id: string,
  toUserId: string,
  reason?: string
): Promise<AdminIssuedTicket> {
  return api.post<AdminIssuedTicket>(
    `/admin/issued-tickets/${id}/transfer`,
    { to_user_id: toUserId, reason }
  )
}
