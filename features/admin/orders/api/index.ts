import type {
  AdminOrder,
  AdminOrderStatus,
  AdminOrdersPage,
} from "@/features/admin/orders/types"
import { api } from "@/lib/api"

export type ListOrdersFilters = {
  status?: AdminOrderStatus
  event_id?: string
  user_id?: string
  from?: string
  to?: string
  min_total?: number
  max_total?: number
  per_page?: number
  page?: number
}

export function listOrders(
  filters: ListOrdersFilters = {}
): Promise<AdminOrdersPage> {
  return api.get<AdminOrdersPage>("/admin/orders", { params: filters })
}

export function getOrder(id: string): Promise<AdminOrder> {
  return api.get<AdminOrder>(`/admin/orders/${id}`)
}

export type RefundOrderInput = {
  amount_minor: number
  reason: string
  notify_user?: boolean
}

export function refundOrder(
  id: string,
  input: RefundOrderInput
): Promise<AdminOrder> {
  return api.post<AdminOrder>(`/admin/orders/${id}/refund`, input)
}

export function cancelOrder(id: string, reason: string): Promise<AdminOrder> {
  return api.post<AdminOrder>(`/admin/orders/${id}/cancel`, { reason })
}

export function markOrderPaid(id: string, reason: string): Promise<AdminOrder> {
  return api.post<AdminOrder>(`/admin/orders/${id}/mark-paid`, { reason })
}
