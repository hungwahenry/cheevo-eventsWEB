import { api } from "@/lib/api"

export type NotificationChannelKey = "email" | "push" | "inapp"
export type NotificationAudienceKey = "organizer" | "attendee"

export type NotificationChannelOption = {
  channel: NotificationChannelKey
  label: string
  enabled: boolean
}

export type NotificationTypeOption = {
  type: string
  label: string
  description: string
  audience: NotificationAudienceKey
  channels: NotificationChannelOption[]
}

export type NotificationPreferences = {
  audiences: Array<{ value: NotificationAudienceKey; label: string }>
  types: NotificationTypeOption[]
}

export type PreferenceUpdate = {
  type: string
  channel: NotificationChannelKey
  enabled: boolean
}

export function getNotificationPreferences(): Promise<NotificationPreferences> {
  return api.get<NotificationPreferences>("/notifications/preferences")
}

export function updateNotificationPreferences(
  preferences: PreferenceUpdate[]
): Promise<null> {
  return api.patch<null>("/notifications/preferences", { preferences })
}
