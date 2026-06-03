import type {
  AdminPayout,
  AdminPayoutStatus,
  AdminPayoutsPage,
} from "@/features/admin/payouts/types"
import { api } from "@/lib/api"

export type ListPayoutsFilters = {
  status?: AdminPayoutStatus
  organisation_id?: string
  from?: string
  to?: string
  per_page?: number
  page?: number
}

export function listPayouts(
  filters: ListPayoutsFilters = {}
): Promise<AdminPayoutsPage> {
  return api.get<AdminPayoutsPage>("/admin/payouts", { params: filters })
}

export function getPayout(id: string): Promise<AdminPayout> {
  return api.get<AdminPayout>(`/admin/payouts/${id}`)
}

export function approvePayout(
  id: string,
  note?: string
): Promise<AdminPayout> {
  return api.post<AdminPayout>(`/admin/payouts/${id}/approve`, { note })
}

export function rejectPayout(id: string, note: string): Promise<AdminPayout> {
  return api.post<AdminPayout>(`/admin/payouts/${id}/reject`, { note })
}

export function markPayoutPaid(
  id: string,
  note: string
): Promise<AdminPayout> {
  return api.post<AdminPayout>(`/admin/payouts/${id}/mark-paid`, { note })
}

export function retryPayout(id: string): Promise<AdminPayout> {
  return api.post<AdminPayout>(`/admin/payouts/${id}/retry`)
}
