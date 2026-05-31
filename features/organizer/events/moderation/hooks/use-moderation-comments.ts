import { listModerationComments } from "@/features/organizer/events/moderation/api"
import { useInfiniteQuery } from "@tanstack/react-query"

export const moderationCommentsKey = (eventId: string) =>
  ["organizer-event-comments", eventId] as const

export function useModerationComments(eventId: string) {
  return useInfiniteQuery({
    queryKey: moderationCommentsKey(eventId),
    queryFn: ({ pageParam }) => listModerationComments(eventId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.last_page ? last.page + 1 : undefined,
  })
}
