export type FeatureFlagKey =
  | "comments.enabled"
  | "comments.giphy_picker"
  | "rsvp.enabled"
  | "places.search"
  | "notifications.push"
  | "broadcasts.enabled"
  | "payouts.enabled"
  | "admin.system_announcements"

export type ConfigKey =
  | "orders.hold_ttl_minutes"
  | "orders.fee_flat_minor"
  | "orders.fee_percentage_bps"
  | "orders.items_per_quote_max"
  | "orders.item_quantity_max"
  | "search.results_per_group_limit"
  | "search.per_page_default"
  | "search.per_page_max"
  | "search.giphy_page_size"
  | "search.giphy_debounce_ms"
  | "auth.otp_length"
  | "auth.otp_ttl_minutes"
  | "auth.otp_max_attempts"
  | "auth.otp_resend_cooldown_seconds"
  | "auth.stepup_resend_cooldown_seconds"
  | "auth.stepup_max_attempts"

export type FlagsResponse = Partial<Record<FeatureFlagKey, boolean>>

export type ConfigResponse = Partial<Record<ConfigKey, unknown>>
