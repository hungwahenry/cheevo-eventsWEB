export type AdminComment = {
  id: string
  event_id: string
  parent_id: string | null
  body: string | null
  gif: unknown | null
  likes_count: number
  replies_count: number
  flags_count: number
  created_at: string | null
  author?: { id: string; email: string; username: string | null }
  event?: { id: string; title: string; slug: string }
}

export type AdminCommentsPage = {
  items: AdminComment[]
  page: number
  last_page: number
  per_page: number
  total: number
}
