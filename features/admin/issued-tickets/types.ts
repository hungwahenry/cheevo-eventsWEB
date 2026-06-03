export type AdminIssuedTicketStatus = "valid" | "scanned" | "revoked"

export type AdminIssuedTicket = {
  id: string
  code: string
  status: AdminIssuedTicketStatus
  scanned_at: string | null
  created_at: string | null
  event?: { id: string; title: string; slug: string } | null
  ticket?: { id: string; name: string } | null
  holder?: {
    id: string
    email: string
    username: string | null
  } | null
  order?: { id: string; status: string } | null
}

export type AdminIssuedTicketsPage = {
  items: AdminIssuedTicket[]
  page: number
  last_page: number
  per_page: number
  total: number
}
