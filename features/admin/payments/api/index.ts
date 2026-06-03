import type {
  AdminPayment,
  AdminPaymentStatus,
  AdminPaymentsPage,
} from "@/features/admin/payments/types"
import { api } from "@/lib/api"

export type ListPaymentsFilters = {
  q?: string
  provider?: "paystack" | "flutterwave"
  status?: AdminPaymentStatus
  from?: string
  to?: string
  per_page?: number
  page?: number
}

export function listPayments(
  filters: ListPaymentsFilters = {}
): Promise<AdminPaymentsPage> {
  return api.get<AdminPaymentsPage>("/admin/payments", { params: filters })
}

export function getPayment(id: string): Promise<AdminPayment> {
  return api.get<AdminPayment>(`/admin/payments/${id}`)
}

export function resyncPayment(id: string): Promise<AdminPayment> {
  return api.post<AdminPayment>(`/admin/payments/${id}/resync`)
}

export function markPaymentSuccess(
  id: string,
  reason: string
): Promise<AdminPayment> {
  return api.post<AdminPayment>(`/admin/payments/${id}/mark-success`, {
    reason,
  })
}
