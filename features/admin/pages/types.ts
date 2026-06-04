export type AdminPage = {
  id: string
  slug: string
  title: string
  body_html: string
  meta_description: string | null
  is_published: boolean
  published_at: string | null
  created_at: string | null
  updated_at: string | null
}

export type AdminPagesPage = {
  items: AdminPage[]
  page: number
  last_page: number
  per_page: number
  total: number
}

export type UpsertPagePayload = {
  slug?: string
  title?: string
  body_html?: string
  meta_description?: string | null
}
