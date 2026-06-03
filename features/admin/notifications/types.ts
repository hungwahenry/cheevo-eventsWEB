export type AnnouncementAudience = "all" | "role" | "user_ids"
export type AnnouncementRole = "attendee" | "organiser" | "admin"
export type AnnouncementChannel = "email" | "push" | "inapp"

export type BroadcastAnnouncementPayload = {
  audience: AnnouncementAudience
  role?: AnnouncementRole
  user_ids?: string[]
  title: string
  body: string
  channels: AnnouncementChannel[]
}

export type BroadcastAnnouncementResult = {
  recipients: number
  chunks: number
}

export type ExpoTokenHealth = {
  total: number
  active_last_7d: number
  active_last_30d: number
  stale: number
}
