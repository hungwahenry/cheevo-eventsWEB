import { flagComment, unflagComment } from "@/features/organizer/events/moderation/api"
import { moderationCommentsKey } from "@/features/organizer/events/moderation/hooks/use-moderation-comments"
import { moderationRepliesKey } from "@/features/organizer/events/moderation/hooks/use-moderation-replies"
import type {
  ModerationComment,
  ModerationCommentsPage,
} from "@/features/organizer/events/moderation/types"
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query"
import { toast } from "sonner"

type Args = { comment: ModerationComment; next: boolean; reason?: string }

export function useToggleFlag(eventId: string) {
  const queryClient = useQueryClient()

  const apply = (comment: ModerationComment, next: boolean) => {
    const updater = (prev?: InfiniteData<ModerationCommentsPage>) =>
      prev
        ? {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              items: page.items.map((c) =>
                c.id === comment.id
                  ? {
                      ...c,
                      is_flagged_by_me: next,
                      flags_count: Math.max(0, c.flags_count + (next ? 1 : -1)),
                    }
                  : c
              ),
            })),
          }
        : prev

    queryClient.setQueryData<InfiniteData<ModerationCommentsPage>>(
      moderationCommentsKey(eventId),
      updater
    )

    if (comment.parent_id !== null) {
      queryClient.setQueryData<InfiniteData<ModerationCommentsPage>>(
        moderationRepliesKey(eventId, comment.parent_id),
        updater
      )
    }
  }

  return useMutation({
    mutationFn: ({ comment, next, reason }: Args) =>
      next
        ? flagComment(eventId, comment.id, reason)
        : unflagComment(eventId, comment.id),
    onMutate: ({ comment, next }) => {
      apply(comment, next)
      return { comment, next }
    },
    onSuccess: (_data, { next }) => {
      toast.success(next ? "Flagged for review." : "Flag removed.")
    },
    onError: (_err, { comment, next }) => {
      apply(comment, !next)
    },
  })
}
