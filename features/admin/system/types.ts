export type AdminFeatureFlag = {
  id: string
  key: string
  description: string | null
  enabled: boolean
  rollout_pct: number
  is_public: boolean
  updated_at: string | null
}

export type SystemConfigType = "bool" | "int" | "decimal" | "string" | "json"

export type AdminSystemConfig = {
  id: string
  key: string
  description: string | null
  group: string
  type: SystemConfigType
  value: unknown
  default_value: unknown
  is_dirty: boolean
  is_public: boolean
  updated_at: string | null
}

export type UpdateFlagPayload = {
  enabled?: boolean
  rollout_pct?: number
  description?: string
  is_public?: boolean
}

export type UpdateConfigPayload = {
  value: unknown
  description?: string
  is_public?: boolean
}
