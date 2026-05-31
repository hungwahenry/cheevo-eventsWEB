import { listModerationComments } from "@/features/organizer/events/moderation/api"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const moderationCommentsKey = (
  eventId: string,
  page: number,
  q?: string,
  flaggedOnly?: boolean
) =>
  [
    "organizer-event-comments",
    eventId,
    page,
    q?.trim() ?? "",
    flaggedOnly ? "flagged" : "all",
  ] as const

export function useModerationComments(
  eventId: string,
  page: number,
  q?: string,
  flaggedOnly?: boolean
) {
  return useQuery({
    queryKey: moderationCommentsKey(eventId, page, q, flaggedOnly),
    queryFn: () =>
      listModerationComments(eventId, page, 20, { q, flaggedOnly }),
    placeholderData: keepPreviousData,
  })
}
