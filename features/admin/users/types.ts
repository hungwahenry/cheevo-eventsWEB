export type AdminUserRole = "attendee" | "organiser" | "admin"

export type AdminUser = {
  id: string
  email: string
  role: AdminUserRole
  email_verified_at: string | null
  suspended_at: string | null
  suspended_reason: string | null
  created_at: string | null
  profile?: {
    username: string | null
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
    city: string | null
    completed_at: string | null
  } | null
  counts?: {
    orders: number
    comments: number
    organisations: number
    tokens: number
  }
}

export type AdminUsersPage = {
  items: AdminUser[]
  page: number
  last_page: number
  per_page: number
  total: number
}
