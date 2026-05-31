import type {
  EventOrder,
  EventSales,
  OrderStatus,
  OrdersPage,
} from "@/features/organizer/events/sales/types"
import { api } from "@/lib/api"

export function getEventSales(eventId: string): Promise<EventSales> {
  return api.get<EventSales>(`/organizer/events/${eventId}/sales`)
}

export function listEventOrders(
  eventId: string,
  page: number,
  perPage = 20,
  status?: OrderStatus
): Promise<OrdersPage> {
  return api.get<OrdersPage>(`/organizer/events/${eventId}/orders`, {
    params: { page, per_page: perPage, ...(status ? { status } : {}) },
  })
}

export function getEventOrder(
  eventId: string,
  orderId: string
): Promise<EventOrder> {
  return api.get<EventOrder>(`/organizer/events/${eventId}/orders/${orderId}`)
}
