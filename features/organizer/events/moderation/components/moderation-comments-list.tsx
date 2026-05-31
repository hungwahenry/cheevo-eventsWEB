"use client"

import { Button } from "@/components/ui/button"
import { ModerationCommentRow } from "@/features/organizer/events/moderation/components/moderation-comment-row"
import { ModerationReplies } from "@/features/organizer/events/moderation/components/moderation-replies"
import { useModerationComments } from "@/features/organizer/events/moderation/hooks"
import { useMemo } from "react"

export function ModerationCommentsList({ eventId }: { eventId: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useModerationComments(eventId)

  const items = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  )

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-10 text-center">
        <p className="text-sm font-medium">No comments yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Comments from attendees will appear here. Flag anything that needs an
          admin&apos;s eyes.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="divide-y rounded-xl border">
        {items.map((comment) => (
          <li key={comment.id}>
            <ModerationCommentRow comment={comment} />
            <ModerationReplies parent={comment} />
          </li>
        ))}
      </ul>

      {hasNextPage ? (
        <Button
          variant="outline"
          size="sm"
          className="self-center"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </Button>
      ) : null}
    </div>
  )
}
