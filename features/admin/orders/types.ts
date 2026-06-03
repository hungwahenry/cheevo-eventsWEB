export type AdminOrderStatus = "pending" | "paid" | "cancelled" | "refunded"

export type AdminOrderItem = {
  id: string
  ticket_name: string
  quantity: number
  unit_price_minor: number
  subtotal_minor: number
}

export type AdminOrderPayment = {
  id: string
  provider: string
  reference: string
  provider_reference: string | null
  status: string
  amount_minor: number
  authorized_at: string | null
  refunded_at: string | null
}

export type AdminOrder = {
  id: string
  status: AdminOrderStatus
  subtotal_minor: number
  fees_minor: number
  total_minor: number
  items_quantity_total: number
  currency: string
  paid_at: string | null
  cancelled_at: string | null
  refunded_at: string | null
  created_at: string | null
  user?: { id: string; email: string; username: string | null } | null
  event?: { id: string; title: string; slug: string } | null
  items?: AdminOrderItem[]
  payment?: AdminOrderPayment | null
}

export type AdminOrdersPage = {
  items: AdminOrder[]
  page: number
  last_page: number
  per_page: number
  total: number
}
