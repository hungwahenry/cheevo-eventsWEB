export type SearchReindexStatus = {
  state: "running" | "completed"
  started_at: string | null
  finished_at: string | null
  counts: {
    events: number
    organisations: number
    users: number
  } | null
}

export type SearchHealth = {
  indexed: {
    event: number
    organisation: number
    user: number
  }
  source: {
    events: number
    organisations: number
    users: number
  }
  last_reindex: SearchReindexStatus | null
}
