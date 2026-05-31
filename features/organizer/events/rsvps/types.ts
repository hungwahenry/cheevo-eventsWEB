export type EventRsvp = {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  rsvped_at: string
}

export type RsvpsPage = {
  items: EventRsvp[]
  page: number
  last_page: number
  per_page: number
  total: number
}
