export type SalesPerTicket = {
  ticket_id: string
  name: string
  sold_count: number
  quantity: number | null
  revenue_minor: number
}

export type EventSales = {
  currency: string
  gross_minor: number
  fees_minor: number
  revenue_minor: number
  orders_count: number
  tickets_sold: number
  per_ticket: SalesPerTicket[]
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "cancelled"
  | "refunded"
  | "failed"

export type OrderBuyer = {
  email: string | null
  username: string | null
  display_name: string | null
  avatar_url: string | null
}

export type EventOrderItem = {
  id: string
  event_ticket_id: string
  ticket_name: string
  quantity: number
  unit_price_minor: number
  subtotal_minor: number
}

export type EventOrder = {
  id: string
  status: OrderStatus
  subtotal_minor: number
  fees_minor: number
  total_minor: number
  currency: string
  items_count: number
  paid_at: string | null
  cancelled_at: string | null
  refunded_at: string | null
  created_at: string
  buyer: OrderBuyer
  items?: EventOrderItem[]
}

export type OrdersPage = {
  items: EventOrder[]
  page: number
  last_page: number
  per_page: number
  total: number
}
