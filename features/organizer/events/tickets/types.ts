export type TicketStatus = "draft" | "on_sale" | "paused"

export type EventTicket = {
  id: string
  name: string
  description: string | null
  gross_price: number
  display_price: number | null
  quantity: number | null
  sort_order: number
  status: TicketStatus
  sales_starts_at: string | null
  sales_ends_at: string | null
  valid_from: string | null
  valid_to: string | null
  max_per_order: number | null
}

export type TicketInput = {
  name: string
  description?: string | null
  gross_price: number
  display_price?: number | null
  quantity?: number | null
  status?: TicketStatus
  sales_starts_at?: string | null
  sales_ends_at?: string | null
  valid_from?: string | null
  valid_to?: string | null
  max_per_order?: number | null
}
