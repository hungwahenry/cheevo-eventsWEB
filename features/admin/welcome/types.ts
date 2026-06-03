export type AdminWelcomeContent = {
  headline: string
  subheadline: string
  background_url: string | null
  background_path: string | null
  updated_at: string | null
}

export type UpdateWelcomePayload = {
  headline?: string
  subheadline?: string
  background?: File
  clear_background?: boolean
}
