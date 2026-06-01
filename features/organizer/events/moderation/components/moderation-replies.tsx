"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ModerationCommentRow } from "@/features/organizer/events/moderation/components/moderation-comment-row"
import { useModerationReplies } from "@/features/organizer/events/moderation/hooks"
import type { ModerationComment } from "@/features/organizer/events/moderation/types"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { useMemo, useState } from "react"

export function ModerationReplies({
  parent,
}: {
  parent: ModerationComment
}) {
  const [expanded, setExpanded] = useState(false)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useModerationReplies(parent.event_id, parent.id, expanded)

  const replies = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  )

  if (parent.replies_count === 0) return null

  return (
    <div className="pl-12 pr-4 pb-3">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <span className="h-px w-5 bg-muted-foreground/40" />
        {expanded ? "Hide" : `View ${parent.replies_count}`}{" "}
        {parent.replies_count === 1 ? "reply" : "replies"}
        {expanded ? (
          <ChevronUpIcon className="size-3" />
        ) : (
          <ChevronDownIcon className="size-3" />
        )}
      </button>

      {expanded ? (
        <div className="mt-1 divide-y rounded-xl bg-muted/30">
          {isLoading ? (
            <div className="flex flex-col gap-2 px-4 py-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : null}

          {replies.map((reply) => (
            <ModerationCommentRow key={reply.id} comment={reply} />
          ))}

          {hasNextPage ? (
            <div className="px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage ? "Loading more…" : "View more replies"}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
