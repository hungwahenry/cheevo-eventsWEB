export type CommentAuthor = {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
}

export type MentionedUser = {
  id: string
  username: string | null
  display_name: string | null
}

export type CommentGif = {
  id: string
  url: string
  width: number
  height: number
}

export type ModerationComment = {
  id: string
  event_id: string
  parent_id: string | null
  body: string | null
  gif: CommentGif | null
  mentions: string[]
  mentioned_users: MentionedUser[]
  likes_count: number
  replies_count: number
  flags_count: number
  is_liked: boolean
  is_going: boolean
  is_flagged_by_me: boolean
  created_at: string
  author: CommentAuthor
}

export type ModerationCommentsPage = {
  items: ModerationComment[]
  page: number
  last_page: number
  per_page: number
  total: number
}

export type FlagResponse = {
  is_flagged_by_me: boolean
  flags_count: number
}
