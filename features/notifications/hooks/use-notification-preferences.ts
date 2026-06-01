import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
  type PreferenceUpdate,
} from "@/features/notifications/api"
import { isApiError } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const notificationPreferencesKey = ["notifications", "preferences"]

export function useNotificationPreferences() {
  return useQuery<NotificationPreferences>({
    queryKey: notificationPreferencesKey,
    queryFn: getNotificationPreferences,
  })
}

export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (update: PreferenceUpdate) =>
      updateNotificationPreferences([update]),
    onMutate: async (update) => {
      await queryClient.cancelQueries({ queryKey: notificationPreferencesKey })
      const previous = queryClient.getQueryData<NotificationPreferences>(
        notificationPreferencesKey
      )

      if (previous) {
        queryClient.setQueryData<NotificationPreferences>(
          notificationPreferencesKey,
          {
            ...previous,
            types: previous.types.map((t) =>
              t.type === update.type
                ? {
                    ...t,
                    channels: t.channels.map((c) =>
                      c.channel === update.channel
                        ? { ...c, enabled: update.enabled }
                        : c
                    ),
                  }
                : t
            ),
          }
        )
      }

      return { previous }
    },
    onError: (error, _update, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationPreferencesKey, context.previous)
      }
      if (isApiError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Could not save preference.")
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationPreferencesKey })
    },
  })
}
