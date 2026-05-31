import { listModerationReplies } from "@/features/organizer/events/moderation/api"
import { useInfiniteQuery } from "@tanstack/react-query"

export const moderationRepliesKey = (eventId: string, commentId: string) =>
  ["organizer-event-comment-replies", eventId, commentId] as const

export function useModerationReplies(
  eventId: string,
  commentId: string,
  enabled: boolean
) {
  return useInfiniteQuery({
    queryKey: moderationRepliesKey(eventId, commentId),
    queryFn: ({ pageParam }) =>
      listModerationReplies(eventId, commentId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.last_page ? last.page + 1 : undefined,
    enabled: enabled && Boolean(commentId),
  })
}
