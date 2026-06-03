export type AdminAuditEntry = {
  id: string
  action: string
  target_type: string | null
  target_id: string | null
  payload: Record<string, unknown> | null
  reason: string | null
  ip: string | null
  user_agent: string | null
  request_id: string | null
  created_at: string | null
  admin?: {
    id: string
    email: string
    username: string | null
  } | null
}

export type AdminAuditLogPage = {
  items: AdminAuditEntry[]
  page: number
  last_page: number
  per_page: number
  total: number
}
