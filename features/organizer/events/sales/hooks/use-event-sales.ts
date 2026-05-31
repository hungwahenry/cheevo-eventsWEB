import {
  getEventOrder,
  getEventSales,
  listEventOrders,
} from "@/features/organizer/events/sales/api"
import type { OrderStatus } from "@/features/organizer/events/sales/types"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

export const salesKey = (eventId: string) =>
  ["organizer-event-sales", eventId] as const

export const ordersKey = (eventId: string, status?: OrderStatus) =>
  ["organizer-event-orders", eventId, status ?? "all"] as const

export const orderDetailKey = (eventId: string, orderId: string) =>
  ["organizer-event-order", eventId, orderId] as const

export function useEventSales(eventId: string) {
  return useQuery({
    queryKey: salesKey(eventId),
    queryFn: () => getEventSales(eventId),
  })
}

export function useEventOrders(eventId: string, status?: OrderStatus) {
  return useInfiniteQuery({
    queryKey: ordersKey(eventId, status),
    queryFn: ({ pageParam }) =>
      listEventOrders(eventId, pageParam, 20, status),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.last_page ? last.page + 1 : undefined,
  })
}

export function useEventOrder(eventId: string, orderId: string) {
  return useQuery({
    queryKey: orderDetailKey(eventId, orderId),
    queryFn: () => getEventOrder(eventId, orderId),
  })
}
