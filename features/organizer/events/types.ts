export type EventStatus = "draft" | "published"

export type Interest = {
  id: number
  slug: string
  name: string
}

export type EventImage = {
  id: string
  url: string
  sort_order: number
}

export type EventFeature = {
  id: string
  title: string
  description: string | null
  image_url: string | null
  link: string | null
  starts_at: string | null
  ends_at: string | null
  sort_order: number
}

export type EventItem = {
  id: string
  title: string
  slug: string
  description: string | null
  starts_at: string | null
  ends_at: string | null
  timezone: string
  venue_name: string | null
  place_id: string | null
  address: string | null
  latitude: string | null
  longitude: string | null
  city: string | null
  flyer_url: string | null
  flyer_type: "image" | "video" | null
  video_url: string | null
  status: EventStatus
  published_at: string | null
  tickets_count: number
  tickets_min_price: number | null
  tickets_max_price: number | null
  currency: string
  rsvps_count: number
  comments_count: number
  created_at: string
  // Loaded on show, omitted from the list response.
  images?: EventImage[]
  features?: EventFeature[]
  tickets?: import("./tickets/types").EventTicket[]
  interests?: Interest[]
}

export type PlacePrediction = {
  place_id: string
  description: string
}

export type PlaceDetails = {
  place_id: string
  name: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  city: string | null
}
