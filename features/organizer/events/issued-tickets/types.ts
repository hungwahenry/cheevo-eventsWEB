export type IssuedTicketStatus = "valid" | "scanned" | "revoked"

export type IssuedTicketHolder = {
  email: string | null
  username: string | null
  display_name: string | null
  avatar_url: string | null
}

export type IssuedTicketScanner = {
  email: string | null
  display_name: string | null
}

export type IssuedTicketOrderSummary = {
  id: string
  total_minor: number
  currency: string
  paid_at: string | null
}

export type IssuedTicket = {
  id: string
  code: string
  status: IssuedTicketStatus
  ticket_name: string
  order_id: string
  scanned_at: string | null
  created_at: string
  holder: IssuedTicketHolder
  scanned_by: IssuedTicketScanner | null
  order?: IssuedTicketOrderSummary | null
  holder_event_tickets_count?: number | null
}

export type IssuedTicketsPage = {
  items: IssuedTicket[]
  page: number
  last_page: number
  per_page: number
  total: number
}
