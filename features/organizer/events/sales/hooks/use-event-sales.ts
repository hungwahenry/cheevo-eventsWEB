import {
  getEventOrder,
  getEventSales,
  listEventOrders,
} from "@/features/organizer/events/sales/api"
import type { OrderStatus } from "@/features/organizer/events/sales/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const salesKey = (eventId: string) =>
  ["organizer-event-sales", eventId] as const

export const ordersKey = (eventId: string, page: number, status?: OrderStatus) =>
  ["organizer-event-orders", eventId, page, status ?? "all"] as const

export const orderDetailKey = (eventId: string, orderId: string) =>
  ["organizer-event-order", eventId, orderId] as const

export function useEventSales(eventId: string) {
  return useQuery({
    queryKey: salesKey(eventId),
    queryFn: () => getEventSales(eventId),
  })
}

export function useEventOrders(eventId: string, page: number, status?: OrderStatus) {
  return useQuery({
    queryKey: ordersKey(eventId, page, status),
    queryFn: () => listEventOrders(eventId, page, 20, status),
    placeholderData: keepPreviousData,
  })
}

export function useEventOrder(eventId: string, orderId: string) {
  return useQuery({
    queryKey: orderDetailKey(eventId, orderId),
    queryFn: () => getEventOrder(eventId, orderId),
  })
}
