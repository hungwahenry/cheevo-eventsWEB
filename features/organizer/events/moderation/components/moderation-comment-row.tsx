"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CommentFlagButton } from "@/features/organizer/events/moderation/components/comment-flag-button"
import type { ModerationComment } from "@/features/organizer/events/moderation/types"
import { formatRelativeShort } from "@/lib/format/datetime"
import Image from "next/image"

export function ModerationCommentRow({
  comment,
}: {
  comment: ModerationComment
}) {
  const displayName =
    comment.author.display_name ?? comment.author.username ?? "Someone"
  const initials = displayName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  const when = formatRelativeShort(comment.created_at)
  const replyingTo =
    comment.parent_id !== null ? comment.mentioned_users[0]?.username : null

  return (
    <div className="flex gap-3 px-4 py-3">
      <Avatar className="size-9 shrink-0">
        {comment.author.avatar_url ? (
          <AvatarImage src={comment.author.avatar_url} alt="" />
        ) : null}
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-medium">{displayName}</span>
          {comment.author.username ? (
            <span className="text-xs text-muted-foreground">
              @{comment.author.username}
            </span>
          ) : null}
          {when ? (
            <span className="text-xs text-muted-foreground">· {when}</span>
          ) : null}
        </div>

        {replyingTo ? (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Replying to{" "}
            <span className="font-medium text-foreground">@{replyingTo}</span>
          </p>
        ) : null}

        {comment.body ? (
          <p className="mt-1 text-sm leading-5">{comment.body}</p>
        ) : null}

        {comment.gif ? (
          <div className="mt-2 inline-block overflow-hidden rounded-lg bg-muted">
            <Image
              src={comment.gif.url}
              alt=""
              width={180}
              height={Math.round(
                (180 / (comment.gif.width || 1)) * (comment.gif.height || 1)
              )}
              unoptimized
            />
          </div>
        ) : null}

        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          {comment.replies_count > 0 ? (
            <span>
              {comment.replies_count}{" "}
              {comment.replies_count === 1 ? "reply" : "replies"}
            </span>
          ) : null}
          {comment.likes_count > 0 ? (
            <span>
              {comment.likes_count}{" "}
              {comment.likes_count === 1 ? "like" : "likes"}
            </span>
          ) : null}
          {comment.flags_count > 0 ? (
            <span className="text-destructive">
              {comment.flags_count} flagged
            </span>
          ) : null}
        </div>
      </div>

      <CommentFlagButton comment={comment} />
    </div>
  )
}
